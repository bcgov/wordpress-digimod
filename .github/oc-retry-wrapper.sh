#!/usr/bin/env bash

MAX_RETRIES=${OC_MAX_RETRIES:-3}
BACKOFF_DELAY=${OC_BACKOFF_DELAY:-2}
REAL_OC="${REAL_OC_PATH:-/usr/local/bin/oc}"

if [[ ! -x "$REAL_OC" ]]; then
    echo "Error: Real OpenShift CLI binary not found or not executable at '$REAL_OC'." >&2
    exit 1
fi

# Function to check if stderr indicates a connection/network failure
is_connection_error() {
    local err_output="$1"
    # Common Kubernetes/OpenShift API connection error patterns
    if grep -qE "The connection to the server.*was refused|dial tcp|i/o timeout|No route to host|Client.Timeout exceeded|context deadline exceeded|TLS handshake timeout|connection reset by peer" <<< "$err_output"; then
        return 0 # True, it is a connection error
    fi
    return 1 # False, likely a command failure or other error
}

attempt=1
while true; do
    # Capture stderr in a temp file while still allowing stdout to stream normally
    stderr_file=$(mktemp)
    
    # Run the command, sending stderr to both the terminal and our temp file
    "$REAL_OC" "$@" 2> >(tee "$stderr_file" >&2)
    exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        rm -f "$stderr_file"
        exit 0
    fi

    # Read the captured stderr
    err_output=$(<"$stderr_file")
    rm -f "$stderr_file"

    # Check if we should retry:
    # 1. Must be a recognized connection error
    # 2. Must not have exhausted retries
    if ! is_connection_error "$err_output"; then
        # This was a valid CLI/command error (e.g., oc exec failed, syntax error), do not retry
        exit $exit_code
    fi

    if [[ $attempt -ge $MAX_RETRIES ]]; then
        echo "[oc-wrapper] Connection failed after $MAX_RETRIES attempts. Exiting." >&2
        exit $exit_code
    fi

    echo "[oc-wrapper] Cluster connection error detected. Retrying attempt $((attempt + 1)) of $MAX_RETRIES in ${BACKOFF_DELAY}s..." >&2
    sleep "$BACKOFF_DELAY"
    BACKOFF_DELAY=$((BACKOFF_DELAY * 2))
    attempt=$((attempt + 1))
done