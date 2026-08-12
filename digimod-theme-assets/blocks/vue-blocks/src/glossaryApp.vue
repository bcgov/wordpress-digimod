<template>
  <div ref="appRoot" class="digimod-glossary">
    <div class="digimod-glossary__layout">
      <aside class="digimod-glossary__sidebar">
        <section class="digimod-glossary__panel is-flex-row">
          <h2 class="digimod-glossary__filter-title">{{ searchToolsTitle }}</h2>
          <div class="tag-checkbox">
            <button class="tag clear-filters" :disabled="!hasActiveFilters" @click="clearFilters"
              @keydown.enter.prevent="clearFilters"
              :aria-disabled="!hasActiveFilters ? 'true' : 'false'"
              aria-label="Show all glossary terms and remove previously selected filters.">{{ showAllLabel }}</button>
          </div>
        </section>

        <section v-if="uniqueTags.length > 0" class="digimod-glossary__controls">
          <h3 :id="tagGroupLabelId" class="digimod-glossary__filter-title">{{ filterTitle }}</h3>
          <div class="taxonomy-glossary_category wp-block-post-terms digimod-glossary__filters" role="group"
            :aria-labelledby="tagGroupLabelId">
            <template v-for="(tag, index) in uniqueTags" :key="tag.slug">
              <div class="tag-checkbox">
                <input :id="tagInputId(index)" v-model="selectedTags" class="tag-input" type="checkbox" :value="tag.slug" />
                <label :for="tagInputId(index)" class="tag tag-label" :tabindex="0 === index ? 0 : -1"
                  @pointerup.prevent="handleTagPointerUp(index, $event)" @click.prevent="suppressTagClick"
                  @keydown.enter.prevent="toggleTagInput(index)" @keydown.space.prevent="toggleTagInput(index)"
                  @keydown="handleTagKeyNavigation($event, index)" role="checkbox"
                  :aria-label="getTagAriaLabel(tag)" :aria-checked="getTagAriaChecked(tag)">
                  {{ tag.name }}<template v-if="showTagCounts"> ({{ tag.count }})</template>
                </label>
              </div>
            </template>
          </div>
        </section>

        <section class="digimod-glossary__controls">
          <h3 :id="browseTitleId" class="digimod-glossary__sidebar-title">{{ browseTitle }}</h3>
          <nav class="digimod-glossary__letters" :aria-labelledby="browseTitleId">
            <a
              v-for="letter in allLetters"
              :key="letter.letter"
              class="digimod-glossary__letter-link"
              :class="{ 'is-disabled': !letter.isAvailable }"
              :href="`#${letterId(letter.letter)}`"
              :aria-disabled="letter.isAvailable ? null : 'true'"
              :tabindex="letter.isAvailable ? null : -1"
              @click="handleLetterClick(letter, $event)"
            >
              {{ letter.letter }}
            </a>
          </nav>
        </section>

        <section v-if="hasSuggestionCard" class="digimod-glossary__panel digimod-glossary__suggest-panel">
          <h3 class="digimod-glossary__filter-title pen-line">{{ suggestTitle }}</h3>
          <div v-if="suggestBody" class="digimod-glossary__suggest-body" v-html="suggestBody"></div>
          <p v-if="suggestEmail" class="digimod-glossary__suggest-email">Email <a :href="`mailto:${suggestEmail}`">{{ suggestEmail }}</a></p>
        </section>
      </aside>

      <div class="digimod-glossary__content">
        <component :is="headingCascade.title" class="digimod-glossary__title">{{ title }}</component>
        <div v-if="intro" class="digimod-glossary__intro" v-html="intro"></div>

        <p v-if="!isLoading && filteredEntries.length > 0" class="digimod-glossary__count" aria-live="polite">
              {{ filteredEntries.length }} of {{ entries.length }} terms showing
        </p>

        <div v-if="groupedEntries.length > 0" class="digimod-glossary__results">
          <section v-for="group in groupedEntries" :id="letterId(group.letter)" :key="group.letter"
            class="glossary-entry-group digimod-glossary__group">
            <div class="glossary-entry-flex digimod-glossary__group-layout">
              <component :is="headingCascade.letter" class="glossary-inline-letter">{{ group.letter }}</component>
              <div class="glossary-entry">
                <article v-for="entry in group.entries" :key="entry.id"
                  class="digimod-glossary__entry has-secondary-accent-background-color has-background">
                  <component :is="headingCascade.entry" :id="entry.slug" class="digimod-glossary__term">{{ entry.title }}</component>
                  <div class="entry-content glossary-content digimod-glossary__entry-content" v-html="entry.content"></div>
                  <ul v-if="entry.categories.length > 0" class="digimod-glossary__entry-tags taxonomy-glossary_category wp-block-post-terms"
                    aria-label="Glossary term tags">
                    <li v-for="category in entry.categories" :key="category.slug" class="digimod-glossary__entry-tag"
                      :class="{ active: selectedTags.includes(category.slug) }">
                      {{ category.name }}
                    </li>
                  </ul>
                  <ul v-else class="digimod-glossary__entry-tags taxonomy-glossary_category wp-block-post-terms"
                    aria-label="Glossary term tags">
                    <li class="digimod-glossary__entry-tag" style="opacity: 0.45">
                      Untagged
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
        </div>

        <p v-else-if="isLoading" class="digimod-glossary__loading" aria-live="polite">Loading glossary terms.</p>
        <div v-else class="digimod-glossary__empty" aria-live="polite">
          <p v-if="errorMessage">{{ errorMessage }}</p>
          <p v-else>
            <strong>No results found.</strong><br />
            <a href="#" @click.prevent="clearFilters" @keydown.enter.prevent="clearFilters">Reset filters and try again</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const props = defineProps({
  title: {
    type: String,
    default: 'Glossary',
  },
  titleHeadingLevel: {
    type: String,
    default: 'h1',
  },
  intro: {
    type: String,
    default: "It's important to have a shared vocabulary. The official CSBC glossary is the definitive guide for all BC Public Service employees.",
  },
  searchToolsTitle: {
    type: String,
    default: 'Search tools',
  },
  showAllLabel: {
    type: String,
    default: 'Show all',
  },
  showTagCounts: {
    type: Boolean,
    default: true,
  },
  filterTitle: {
    type: String,
    default: 'Filter: tags',
  },
  browseTitle: {
    type: String,
    default: 'Jump to',
  },
  suggestTitle: {
    type: String,
    default: 'Suggest a new glossary term',
  },
  suggestBody: {
    type: String,
    default: 'Send us your submission for review.',
  },
  suggestEmail: {
    type: String,
    default: 'do.contentdesign@gov.bc.ca',
  },
  instanceId: {
    type: String,
    default: 'digimod-glossary',
  },
});

const appRoot = ref(null);
const entries = ref([]);
const errorMessage = ref('');
const isLoading = ref(true);
const selectedTags = ref([]);

const browseTitleId = computed(() => `${props.instanceId}-browse-title`);
const tagGroupLabelId = computed(() => `${props.instanceId}-tag-group-label`);
const hasSuggestionCard = computed(() => Boolean(props.suggestTitle || props.suggestBody || props.suggestEmail));
const hasActiveFilters = computed(() => selectedTags.value.length > 0);
const headingCascade = computed(() => {
  const titleIndex = Math.max(HEADING_LEVELS.indexOf(props.titleHeadingLevel), 0);

  return {
    title: HEADING_LEVELS[titleIndex],
    letter: HEADING_LEVELS[Math.min(titleIndex + 1, HEADING_LEVELS.length - 1)],
    entry: HEADING_LEVELS[Math.min(titleIndex + 2, HEADING_LEVELS.length - 1)],
  };
});

const tagInputId = (index) => `${props.instanceId}-tag-${index}`;

const getFirstLetter = (title) => {
  const trimmedTitle = title?.trim() || '';
  const firstCharacter = trimmedTitle.charAt(0).toUpperCase();

  return /[A-Z]/.test(firstCharacter) ? firstCharacter : '#';
};

const letterId = (letter) => `${props.instanceId}-glossary-${'#' === letter ? '0-9' : letter.toLowerCase()}`;

const sortedEntries = computed(() => {
  return [...entries.value].sort((entryA, entryB) => {
    return entryA.title.localeCompare(entryB.title, undefined, { sensitivity: 'base' });
  });
});

const filteredEntries = computed(() => {
  if (!selectedTags.value.length) {
    return sortedEntries.value;
  }

  return sortedEntries.value.filter((entry) => {
    return entry.categories.some((category) => selectedTags.value.includes(category.slug));
  });
});

const groupedEntries = computed(() => {
  const groups = [];

  filteredEntries.value.forEach((entry) => {
    const letter = getFirstLetter(entry.title);
    const existingGroup = groups[groups.length - 1];

    if (!existingGroup || existingGroup.letter !== letter) {
      groups.push({ letter, entries: [entry] });
      return;
    }

    existingGroup.entries.push(entry);
  });

  return groups;
});

const uniqueTags = computed(() => {
  const tagMap = new Map();

  entries.value.forEach((entry) => {
    entry.categories.forEach((category) => {
      const existingTag = tagMap.get(category.slug);

      if (existingTag) {
        existingTag.count += 1;
        return;
      }

      tagMap.set(category.slug, {
        ...category,
        count: 1,
      });
    });
  });

  return Array.from(tagMap.values()).sort((tagA, tagB) => {
    return tagA.name.localeCompare(tagB.name, undefined, { sensitivity: 'base' });
  });
});

const allLetters = computed(() => {
  const visibleLetters = new Set(groupedEntries.value.map((group) => group.letter));
  const seenLetters = new Set();

  return sortedEntries.value.reduce((letters, entry) => {
    const letter = getFirstLetter(entry.title);

    if (seenLetters.has(letter)) {
      return letters;
    }

    seenLetters.add(letter);
    letters.push({
      letter,
      isAvailable: visibleLetters.has(letter),
    });

    return letters;
  }, []);
});

const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const glossaryResponse = await fetch('/wp-json/digimod/v1/glossary');

    if (!glossaryResponse.ok) {
      throw new Error(`An error has occurred: ${glossaryResponse.status}`);
    }

    const glossaryData = await glossaryResponse.json();
    entries.value = glossaryData.map((entry) => ({
      ...entry,
      categories: Array.isArray(entry.categories) ? entry.categories : [],
    }));
  } catch (error) {
    errorMessage.value = 'An error occurred while loading glossary terms.';
    console.error('Error fetching glossary entries:', error);
  } finally {
    isLoading.value = false;
  }
};

const runPostRenderEnhancements = async () => {
  await nextTick();

  window.requestAnimationFrame(() => {
    if (!(appRoot.value instanceof HTMLElement)) {
      return;
    }

    if ('function' === typeof window.digmodInitializeDefinitionExperience) {
      window.digmodInitializeDefinitionExperience(appRoot.value, true);
    }
  });
};

const toggleTagInput = (index) => {
  document.getElementById(tagInputId(index))?.click();
};

const suppressTagClick = () => {};

const handleTagPointerUp = (index, event) => {
  if ('mouse' === event.pointerType && 0 !== event.button) {
    return;
  }

  if ('function' === typeof event.currentTarget?.focus) {
    event.currentTarget.focus();
  }

  toggleTagInput(index);
};

const handleTagKeyNavigation = (event, index) => {
  const labels = event.currentTarget?.closest('.digimod-vue-app-root')?.querySelectorAll('.tag-label') || [];

  if (!labels.length) {
    return;
  }

  const focusNext = () => {
    if (index < labels.length - 1) {
      labels[index + 1].focus();
    } else {
      labels[0].focus();
    }
  };

  const focusPrev = () => {
    if (index > 0) {
      labels[index - 1].focus();
    } else {
      labels[labels.length - 1].focus();
    }
  };

  const focusFirst = () => {
    labels[0].focus();
  };

  const focusLast = () => {
    labels[labels.length - 1].focus();
  };

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      focusNext();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      focusPrev();
      break;
    case 'Home':
      event.preventDefault();
      focusFirst();
      break;
    case 'End':
      event.preventDefault();
      focusLast();
      break;
  }
};

const clearFilters = () => {
  selectedTags.value = [];
};

const getTagAriaLabel = (tag) => {
  return `${tag.name} filter ${selectedTags.value.includes(tag.slug) ? 'selected' : 'deselected'}. ${tag.count} terms available.`;
};

const getTagAriaChecked = (tag) => {
  return selectedTags.value.includes(tag.slug) ? 'true' : 'false';
};

const handleLetterClick = (letter, event) => {
  if (!letter.isAvailable) {
    event.preventDefault();
  }
};

watch(filteredEntries, () => {
  if (!isLoading.value) {
    runPostRenderEnhancements();
  }
});

onMounted(async () => {
  await fetchData();
  runPostRenderEnhancements();
});
</script>

<style scoped>
.digimod-glossary {
  --glossary-panel-gap: 1rem;
}

.digimod-glossary__sidebar h2,
.digimod-glossary__sidebar h3 {
  font-size: clamp(0.875rem, 0.875rem + ((1vw - 0.2rem) * 0.436), 1.15rem);
  font-weight: 500;
  margin-block: 0;
}

.digimod-glossary__controls h3 {
  border-bottom: 1px solid rgb(241, 241, 241);
  padding-block-end: 0.5rem;
}

.digimod-glossary__layout {
  display: grid;
  gap: 2rem;
}

.digimod-glossary__sidebar {
  display: grid;
  gap: var(--glossary-panel-gap);
  align-content: start;
}

.digimod-glossary__controls {
  background-color: var(--wp--preset--color--white, #fff);
  border-radius: 1rem;
  padding: 1rem;
}

.digimod-glossary__controls .tag-input:checked + .tag::before {
  display: none;
}

.digimod-glossary__panel {
  background-color: var(--wp--preset--color--background, #fff);
  border-radius: 1rem;
  padding: 1rem;
}

.digimod-glossary__panel.is-flex-row {
  display: flex;
  justify-content: space-between;
}

.digimod-glossary__panel.is-flex-row .tag {
  border: 0;
  color: var(--wp--preset--color--secondary-brand, #003366);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: underline;
}

.digimod-glossary__panel.is-flex-row .tag:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  text-decoration: none;
}

.digimod-glossary__sidebar-title,
.digimod-glossary__filter-title,
.digimod-glossary__title {
  margin-top: 0;
}

.digimod-glossary__filter-title.pen-line {
  font-weight: 400;
}

.digimod-glossary__filter-title.pen-line::before {
  content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBkPSJNIDQyOS44IDM5LjYgYyAtOS40IC05LjQgLTI0LjYgLTkuNCAtMzMuOSAwIEwgMzE5IDExOCBMIDQxOCAxNzEgbCA1NC44IC01NC44IGMgOS40IC05LjQgOS40IC0yNC42IDAgLTMzLjkgTCA0MjkuOCAzOS42IHogTSA4My4xIDM1Mi40IGMgLTcuNiA3LjYgLTEzLjEgMTYuOSAtMTYuMSAyNy4yIEwgMzkuNiA0NzIuNCBsIDkyLjggLTI3LjMgYyAxMC4zIC0zIDE5LjYgLTguNiAyNy4yIC0xNi4xIEwgNDE4IDE3MSBMIDMxOSAxMTggTCA4My4xIDM1Mi40IHogTSAzNzMuMiAxNyBjIDIxLjkgLTIxLjkgNTcuMyAtMjEuOSA3OS4yIDAgTCA0OTUgNTkuNiBjIDIxLjkgMjEuOSAyMS45IDU3LjMgMCA3OS4yIEwgMTgyLjMgNDUxLjYgYyAtMTEuNCAxMS40IC0yNS40IDE5LjcgLTQwLjggMjQuMiBsIC0xMjEgMzUuNiBjIC01LjYgMS43IC0xMS43IDAuMSAtMTUuOCAtNCBzIC01LjcgLTEwLjIgLTQgLTE1LjggbCAzNS42IC0xMjEgYyA0LjUgLTE1LjQgMTIuOSAtMjkuNCAyNC4yIC00MC44IEwgMzczLjIgMTcgeiBNIDI0MCA0ODAgbCAzMjAgMCBjIDguOCAwIDE2IDcuMiAxNiAxNiBzIC03LjIgMTYgLTE2IDE2IGwgLTMyMCAwIGMgLTguOCAwIC0xNiAtNy4yIC0xNiAtMTYgcyA3LjIgLTE2IDE2IC0xNiB6Ii8+PC9zdmc+);
  display: block;
  width: 2rem;
  height: 2rem;
}

.digimod-glossary__letters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-start: 1rem;
}

.digimod-glossary__letter-link {
  align-items: center;
  background-color: var(--wp--preset--color--secondary-accent, #eef4ff);
  border: 1px solid var(--wp--preset--color--secondary-brand, #003366);
  border-radius: 999rem;
  color: currentcolor;
  display: inline-flex;
  font-size: .85rem;
  justify-content: center;
  max-width: 0.66rem;
  min-width: 0.66rem;
  padding: .4rem .5rem;
  text-decoration: none;
  width: 5.66rem;
}

.digimod-glossary__letter-link:is(:hover, :focus-visible) {
  background-color: var(--wp--preset--color--secondary-brand, #003366);
  color: var(--wp--preset--color--secondary-accent, #eef4ff);
  outline: 2px solid var(--wp--preset--color--secondary-brand, #003366);
  outline-offset: 2px;
}

.digimod-glossary__letter-link.is-disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.digimod-glossary__filters {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.digimod-glossary__filters .tag {
  border-radius: 999px;
  font-size: 0.9rem;
  height: auto;
  min-height: 2.25rem;
  padding: 0.45rem 0.8rem;
  user-select: none;
}

.digimod-glossary__filters .tag-checkbox {
  margin-block-start: 1rem;
}

.digimod-glossary__filters .tag-checkbox label:is(:hover, :focus-visible) {
  background-color: var(--wp--preset--color--secondary-accent, #eef4ff);
  color: var(--wp--preset--color--secondary-brand, #003366);
  outline: 2px solid var(--wp--preset--color--secondary-brand, #003366);
  outline-offset: 2px;
}

.digimod-glossary__filters .tag-checkbox label[aria-checked="true"] {
  background-color: var(--wp--preset--color--secondary-brand, #003366);
  color: var(--wp--preset--color--secondary-accent, #eef4ff);
}

.digimod-glossary__suggest-body,
.digimod-glossary__intro {
  margin-block: 0;
}

.digimod-glossary__suggest-email {
  margin-block: 0;
}

.digimod-glossary__intro :deep(*:first-child),
.digimod-glossary__suggest-body :deep(*:first-child) {
  margin-top: 0;
}

.digimod-glossary__intro :deep(*:last-child),
.digimod-glossary__suggest-body :deep(*:last-child) {
  margin-bottom: 0;
}

.digimod-glossary__count {
  color: #666;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.digimod-glossary__group {
  margin-top: 2rem;
  scroll-margin-top: 7rem;
}

.digimod-glossary__group-layout {
  display: grid;
  gap: 1rem;
}

.digimod-glossary__title {
  color: var(--wp--preset--color--primary-brand, currentcolor);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  min-width: 2rem;
  padding-bottom: 0.5rem;
}

.glossary-inline-letter {
  border-bottom: 1px solid #d3d3d3;
  color: var(--wp--preset--color--primary-brand, currentcolor);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  min-width: 2rem;
  padding-bottom: 0.5rem;
}

.glossary-entry-flex .glossary-entry {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.digimod-glossary__entry {
  border-radius: 0.25rem;
  padding: 1rem;
}

.digimod-glossary__term {
  color: var(--wp--preset--color--primary-brand, currentcolor);
  font-size: clamp(0.984rem, 0.984rem + ((1vw - 0.2rem) * 0.817), 1.5rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.digimod-glossary__entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0 0 1rem;
}

.digimod-glossary__entry-tag {
  background-color: var(--wp--preset--color--secondary-accent, #eef4ff);
  border: 1px solid currentcolor;
  border-radius: 999rem;
  font-size: 0.85rem;
  list-style-type: none;
  padding: 0.15rem 0.75rem;
  user-select: none;
}

.digimod-glossary__entry-tag.active {
  background-color: var(--wp--preset--color--secondary-brand, #003366);
  color: var(--wp--preset--color--white, #fff);
}

.digimod-glossary__separator {
  border: 0;
  border-top: 1px solid var(--wp--preset--color--custom-info-border, #d3d3d3);
  margin: 0.75rem 0 0;
}

.digimod-glossary__loading,
.digimod-glossary__empty {
  margin-top: 2rem;
}

.digimod-glossary__loading::before {
  animation: digimod-glossary-spin 0.66s ease-in-out infinite;
  border: 3px solid #ccc;
  border-radius: 50%;
  border-top-color: #333;
  content: '';
  display: inline-block;
  height: 1rem;
  margin-right: 0.5rem;
  vertical-align: text-bottom;
  width: 1rem;
}

:deep(.digimod-glossary__entry-content > *:first-child) {
  margin-top: 0;
}

:deep(.digimod-glossary__entry-content p),
:deep(.digimod-glossary__entry-content li),
:deep(.digimod-glossary__entry-content blockquote) {
  font-size: 1.05rem;
}

@keyframes digimod-glossary-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 900px) {
  .digimod-glossary__layout {
    align-items: start;
    grid-template-columns: minmax(220px, 25%) minmax(0, 1fr);
  }

  .digimod-glossary__sidebar {
    position: sticky;
    top: 2rem;
  }

  .digimod-glossary__group-layout {
    grid-template-columns: 1fr;
  }
}
</style>
