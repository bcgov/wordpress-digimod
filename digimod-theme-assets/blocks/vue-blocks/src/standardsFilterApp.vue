<template>
  <div v-if="uniqueCategories.length > 0" class="standards-filter-controls">
    <div :id="groupLabelId" role="heading" class="sr-only">Filterable Standards Categories</div>
    <div class="taxonomy-standard_category wp-block-post-terms standards-filter-tags" role="group"
      :aria-labelledby="groupLabelId">
      <template v-for="(category, index) in uniqueCategories" :key="category.slug">
        <div class="tag-checkbox">
          <input :id="tagInputId(index)" v-model="selectedCategories" class="tag-input" type="checkbox"
            :value="category.slug" />
          <label :for="tagInputId(index)" class="tag tag-label" :tabindex="0 === index ? 0 : -1"
            @pointerup.prevent="handleTagPointerUp(index, $event)" @click.prevent="suppressTagClick"
            @keydown.enter.prevent="toggleTagInput(index)" @keydown.space.prevent="toggleTagInput(index)"
            @keydown="handleKeyNavigation($event, index)" role="checkbox"
            :aria-label="getCategoryAriaLabel(category)" :aria-checked="getCategoryAriaChecked(category)">
            {{ category.name }}
          </label>
        </div>
      </template>
      <div class="tag-checkbox">
        <button class="tag clear-filters" :disabled="!hasActiveFilters" @click="clearFilters"
          @keydown.enter.prevent="clearFilters" :aria-disabled="hasActiveFilters ? 'false' : 'true'"
          aria-label="Show all Standards and remove previously selected filters.">Show all</button>
      </div>
    </div>
  </div>

  <p v-if="isLoading" class="standards-filter-status" aria-live="polite">Loading Standards.</p>

  <div v-else-if="filteredPosts.length > 0" class="standards-filter-results">
    <div class="num-available" aria-atomic="true" aria-live="polite">{{ filteredPosts.length }} of {{ posts.length }} results
      showing</div>
    <div class="wp-block-columns card-container">
      <div class="wp-block-query standards-card-container">
        <ul class="is-flex-container wp-block-post-template" :class="`columns-${columns}`">
          <li v-for="post in filteredPosts" :key="post.id" class="filter-card standard-card">
            <article class="standard-card-content is-layout-constrained wp-block-group flex-card has-white-background-color has-background">
              <div v-if="post.status" class="standard-status" :class="statusClass(post.status)" aria-label="Standard status">
                {{ post.status.name }}
              </div>

              <div class="standard-card-title">
                <p v-if="post.standardCode" class="standard-code">{{ post.standardCode }}</p>
                 <component :is="cardHeadingLevel" class="wp-block-post-title card-title"
                   :class="cardHeadingFontSizeSlug ? `has-${cardHeadingFontSizeSlug}-font-size` : null"
                   :style="customHeadingFontSizeStyle">{{ post.title }}</component>
              </div>

              <div v-if="post.content" class="standard-card-body" v-html="post.content"></div>

              <ul v-if="post.resources.length > 0" class="standard-card-resources" aria-label="Standard resources">
                <li v-for="(resource, index) in post.resources" :key="`${post.id}-resource-${index}`">
                  <a :href="resource.url" class="standard-resource-link" rel="noopener noreferrer"
                    :download="'url' !== resource.icon ? '' : null">
                    <span v-if="resource.icon && resourceIcon(resource.icon)" class="standard-resource-icon"
                      :class="`standard-resource-icon--${resource.icon}`" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" :viewBox="resourceIcon(resource.icon).viewBox"
                        fill="currentColor" aria-hidden="true" focusable="false">
                        <path :d="resourceIcon(resource.icon).path" />
                      </svg>
                    </span>
                    <span class="standard-resource-label">{{ resource.labelText || resource.label }}</span>
                    <span v-if="hasResourceFilesize(resource)" class="standard-resource-filesize">{{ resource.filesize }}</span>
                  </a>
                </li>
              </ul>

              <div v-if="post.categories.length > 0" class="standard-card-category-group">
                <div role="heading" class="sr-only">Applicable Standard Categories</div>
                <ul class="taxonomy-standard_category wp-block-post-terms standard-card-categories"
                  aria-label="Standard Categories">
                  <li v-for="category in post.categories" :key="category.slug" class="tag"
                    :class="{ active: selectedCategories.includes(category.slug) }">
                    {{ category.name }}
                  </li>
                </ul>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-else-if="errorMessage" class="no-results" aria-live="polite">
    <p><strong>{{ errorMessage }}</strong></p>
  </div>

  <p v-else class="no-results" aria-live="polite"><strong>No results found.</strong><br />
    <a href="#" @click.prevent="clearFilters" @keydown.enter.prevent="clearFilters">Reset filters and try again</a>.
  </p>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  columns: {
    type: Number,
    default: 3,
  },
  cardHeadingLevel: {
    type: String,
    default: 'h3',
  },
  cardHeadingFontSize: {
    type: String,
    default: '',
  },
  cardHeadingFontSizeSlug: {
    type: String,
    default: '',
  },
  instanceId: {
    type: String,
    default: 'standards-filter',
  },
});

const posts = ref([]);
const selectedCategories = ref([]);
const errorMessage = ref('');
const isLoading = ref(true);

const columns = computed(() => props.columns);
const groupLabelId = computed(() => `${props.instanceId}-group-label`);
const hasActiveFilters = computed(() => selectedCategories.value.length > 0);
const customHeadingFontSizeStyle = computed(() => {
  if (!props.cardHeadingFontSize || props.cardHeadingFontSizeSlug) {
    return undefined;
  }

  return {
    fontSize: /^\d+(\.\d+)?$/.test(props.cardHeadingFontSize)
      ? `${props.cardHeadingFontSize}px`
      : props.cardHeadingFontSize,
  };
});

const tagInputId = (index) => `${props.instanceId}-category-${index}`;

const normalizePost = (post) => ({
  ...post,
  categories: Array.isArray(post.categories) ? post.categories : [],
  resources: Array.isArray(post.resources) ? post.resources : [],
});

const compareStandards = (standardA, standardB) => {
  const codeA = String(standardA.standardCode || '').trim();
  const codeB = String(standardB.standardCode || '').trim();
  const numericCodeA = '' !== codeA && Number.isFinite(Number(codeA));
  const numericCodeB = '' !== codeB && Number.isFinite(Number(codeB));
  let codeComparison = 0;

  if (numericCodeA && numericCodeB) {
    codeComparison = Number(codeA) - Number(codeB);
  } else {
    codeComparison = codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
  }

  if (0 !== codeComparison) {
    return codeComparison;
  }

  return standardA.title.localeCompare(standardB.title, undefined, { sensitivity: 'base' });
};

const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/wp-json/digimod/v1/standards');

    if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
    }

    const standardsData = await response.json();

    posts.value = (Array.isArray(standardsData) ? standardsData : [])
      .map(normalizePost)
      .sort(compareStandards);
  } catch (error) {
    errorMessage.value = 'An error occurred while loading Standards.';
    console.error('Error fetching Standards:', error);
  } finally {
    isLoading.value = false;
  }
};

const uniqueCategories = computed(() => {
  const categoryMap = new Map();

  posts.value.forEach((post) => {
    post.categories.forEach((category) => {
      if (!categoryMap.has(category.slug)) {
        categoryMap.set(category.slug, category);
      }
    });
  });

  return Array.from(categoryMap.values()).sort((categoryA, categoryB) => {
    return categoryA.name.localeCompare(categoryB.name, undefined, { sensitivity: 'base' });
  });
});

const filteredPosts = computed(() => {
  if (!selectedCategories.value.length) {
    return posts.value;
  }

  return posts.value.filter((post) => {
    return post.categories.some((category) => selectedCategories.value.includes(category.slug));
  });
});

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

const handleKeyNavigation = (event, index) => {
  const labels = event.currentTarget?.closest('.digimod-vue-app-root')?.querySelectorAll('.tag-label') || [];

  if (!labels.length) {
    return;
  }

  const focusNext = () => {
    labels[index < labels.length - 1 ? index + 1 : 0].focus();
  };

  const focusPrevious = () => {
    labels[index > 0 ? index - 1 : labels.length - 1].focus();
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
      focusPrevious();
      break;
    case 'Home':
      event.preventDefault();
      labels[0].focus();
      break;
    case 'End':
      event.preventDefault();
      labels[labels.length - 1].focus();
      break;
  }
};

const getCategoryAriaLabel = (category) => {
  return `${category.name} filter ${selectedCategories.value.includes(category.slug) ? 'selected' : 'deselected'}`;
};

const getCategoryAriaChecked = (category) => {
  return selectedCategories.value.includes(category.slug) ? 'true' : 'false';
};

const clearFilters = () => {
  selectedCategories.value = [];
};

const statusClass = (status) => {
  return status?.colorSlug ? `standard-status--${status.colorSlug}` : '';
};

const hasResourceFilesize = (resource) => {
  const filesize = String(resource?.filesize ?? '').trim();

  return 'url' !== resource?.icon && '' !== filesize && '0' !== filesize;
};

const RESOURCE_ICONS = {
  generic: {
    viewBox: '0 0 384 512',
    path: 'M352 448l0-256-112 0c-26.5 0-48-21.5-48-48l0-112L64 32C46.3 32 32 46.3 32 64l0 384c0 17.7 14.3 32 32 32l256 0c17.7 0 32-14.3 32-32zm-.5-288c-.7-2.8-2.1-5.4-4.2-7.4L231.4 36.7c-2.1-2.1-4.6-3.5-7.4-4.2L224 144c0 8.8 7.2 16 16 16l111.5 0zM0 64C0 28.7 28.7 0 64 0L220.1 0c12.7 0 24.9 5.1 33.9 14.1L369.9 129.9c9 9 14.1 21.2 14.1 33.9L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z',
  },
  xls: {
    viewBox: '0 0 512 512',
    path: 'M64 480l80 0 0 32-80 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L220.1 0c12.7 0 24.9 5.1 33.9 14.1L369.9 129.9c9 9 14.1 21.2 14.1 33.9L384 304l-32 0 0-112-112 0c-26.5 0-48-21.5-48-48l0-112L64 32C46.3 32 32 46.3 32 64l0 384c0 17.7 14.3 32 32 32zM351.5 160c-.7-2.8-2.1-5.4-4.2-7.4L231.4 36.7c-2.1-2.1-4.6-3.5-7.4-4.2L224 144c0 8.8 7.2 16 16 16l111.5 0zM224 368c0 7.3 2.2 14.4 6.2 20.4l9.8 14.7 9.8-14.7c4-6.1 6.2-13.2 6.2-20.4c0-8.8 7.2-16 16-16s16 7.2 16 16c0 13.6-4 26.9-11.6 38.2L259.2 432l17.2 25.8C284 469.1 288 482.4 288 496c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-7.3-2.2-14.4-6.2-20.4L240 460.8l-9.8 14.7c-4 6.1-6.2 13.2-6.2 20.4c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-13.6 4-26.9 11.6-38.2L220.8 432l-17.2-25.8C196 394.9 192 381.6 192 368c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 128l0-128c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16zm88-98.3c0-25.2 20.4-45.7 45.7-45.7l26.3 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-26.3 0c-7.5 0-13.7 6.1-13.7 13.7c0 5.2 2.9 9.9 7.6 12.2l31.2 15.6c15.5 7.7 25.2 23.5 25.2 40.8c0 25.2-20.4 45.7-45.7 45.7L432 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l26.3 0c7.5 0 13.7-6.1 13.7-13.7c0-5.2-2.9-9.9-7.6-12.2l-31.2-15.6C417.8 430.8 408 415 408 397.7z',
  },
  doc: {
    viewBox: '0 0 512 512',
    path: 'M64 480l48 0 0 32-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L220.1 0c12.7 0 24.9 5.1 33.9 14.1L369.9 129.9c9 9 14.1 21.2 14.1 33.9L384 304l-32 0 0-112-112 0c-26.5 0-48-21.5-48-48l0-112L64 32C46.3 32 32 46.3 32 64l0 384c0 17.7 14.3 32 32 32zM351.5 160c-.7-2.8-2.1-5.4-4.2-7.4L231.4 36.7c-2.1-2.1-4.6-3.5-7.4-4.2L224 144c0 8.8 7.2 16 16 16l111.5 0zM176 352l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm16 128l16 0c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96zM456 352l16 0c22.1 0 40 17.9 40 40l0 8c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-8c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 80c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-8c0-8.8 7.2-16 16-16s16 7.2 16 16l0 8c0 22.1-17.9 40-40 40l-16 0c-22.1 0-40-17.9-40-40l0-80c0-22.1 17.9-40 40-40zM288 392c0-22.1 17.9-40 40-40l16 0c22.1 0 40 17.9 40 40l0 80c0 22.1-17.9 40-40 40l-16 0c-22.1 0-40-17.9-40-40l0-80zm40-8c-4.4 0-8 3.6-8 8l0 80c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-80c0-4.4-3.6-8-8-8l-16 0z',
  },
  pdf: {
    viewBox: '0 0 512 512',
    path: 'M64 480l48 0 0 32-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L220.1 0c12.7 0 24.9 5.1 33.9 14.1L369.9 129.9c9 9 14.1 21.2 14.1 33.9L384 304l-32 0 0-112-112 0c-26.5 0-48-21.5-48-48l0-112L64 32C46.3 32 32 46.3 32 64l0 384c0 17.7 14.3 32 32 32zM351.5 160c-.7-2.8-2.1-5.4-4.2-7.4L231.4 36.7c-2.1-2.1-4.6-3.5-7.4-4.2L224 144c0 8.8 7.2 16 16 16l111.5 0zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z',
  },
  url: {
    viewBox: '0 0 640 512',
    path: 'M580.3 267.2c56.2-56.2 56.2-147.3 0-203.5C526.8 10.2 440.9 7.3 383.9 57.2l-6.1 5.4c-10 8.7-11 23.9-2.3 33.9s23.9 11 33.9 2.3l6.1-5.4c38-33.2 95.2-31.3 130.9 4.4c37.4 37.4 37.4 98.1 0 135.6L433.1 346.6c-37.4 37.4-98.2 37.4-135.6 0c-35.7-35.7-37.6-92.9-4.4-130.9l4.7-5.4c8.7-10 7.7-25.1-2.3-33.9s-25.1-7.7-33.9 2.3l-4.7 5.4c-49.8 57-46.9 142.9 6.6 196.4c56.2 56.2 147.3 56.2 203.5 0L580.3 267.2zM59.7 244.8C3.5 301 3.5 392.1 59.7 448.2c53.6 53.6 139.5 56.4 196.5 6.5l6.1-5.4c10-8.7 11-23.9 2.3-33.9s-23.9-11-33.9-2.3l-6.1 5.4c-38 33.2-95.2 31.3-130.9-4.4c-37.4-37.4-37.4-98.1 0-135.6L207 165.4c37.4-37.4 98.1-37.4 135.6 0c35.7 35.7 37.6 92.9 4.4 130.9l-5.4 6.1c-8.7 10-7.7 25.1 2.3 33.9s25.1 7.7 33.9-2.3l5.4-6.1c49.9-57 47-142.9-6.5-196.5c-56.2-56.2-147.3-56.2-203.5 0L59.7 244.8z',
  },
};

const resourceIcon = (icon) => RESOURCE_ICONS[icon] || null;

onMounted(fetchData);
</script>

<style scoped>
.standards-filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 2rem 0.33rem 0.5rem 0;
  width: 100%;
}

.standards-filter-tags {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.33rem;
  justify-content: flex-start;
  width: 100%;
}

.standards-filter-tags .tag-label {
  padding: 0.33rem 0.66rem;
}

.standards-filter-tags .tag-label:focus-visible,
.standards-filter-tags .tag-label:hover,
.standards-filter-tags .tag-input:checked + .tag:focus-visible,
.standards-filter-tags .tag-input:checked + .tag:hover {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  outline: 2px solid var(--wp--preset--color--white);
  outline-offset: -4px;
}

.standards-filter-tags .tag-input:checked + .tag {
  background-color: var(--wp--preset--color--secondary-brand);
  border: 2px solid var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  padding: calc(0.33rem - 1px) calc(0.66rem - 1px);
}

.standards-card-container {
  width: 100%;
}

.standard-card {
  border-radius: 1rem;
}

.standard-card-content {
  border-radius: 1rem !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
  position: relative;
}

.standard-card-content > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.standard-code {
  color: var(--wp--preset--color--secondary-brand);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 0;
  margin-top: 0;
  text-transform: uppercase;
}

.standard-card .card-title {
  color: var(--wp--preset--color--foreground);
  margin-block: 0;
}

.standard-card-body {
  font-size: 1rem;
}

.standard-card-body > :last-child {
  margin-bottom: 0 !important;
}

.standard-card-resources {
  list-style: none;
  margin: auto 0 0;
  padding: 1rem 0 0;
}

.standard-card-resources li + li {
  margin-top: 0.5rem;
}

.standard-resource-link {
  align-items: center;
  background-color: var(--wp--preset--color--background);
  border: 2px solid var(--wp--preset--color--primary-brand);
  box-sizing: border-box;
  border-radius: 0.5rem;
  color: var(--wp--preset--color--foreground);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-weight: 700;
  padding: 0.375rem 0.5rem;
  text-decoration: none;
  max-width: 100%;
  width: 100%;
}

.standard-resource-link:hover,
.standard-resource-link:focus-visible {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: 2px;
}

.standard-resource-label {
  flex: 1 1 auto;
  text-align: left;
}

.standard-resource-icon {
  display: inline-flex;
  height: 1.1rem;
  width: 1.1rem;
}

.standard-resource-icon svg {
  display: block;
  fill: currentColor;
  height: 100%;
  width: 100%;
}

.standard-resource-filesize {
  font-weight: 400;
  margin-left: auto;
  text-align: right;
}

.standard-card-category-group {
  margin-top: 0;
  padding-top: 1.25rem;
}

.standard-card-content:not(:has(.standard-card-resources)) .standard-card-category-group {
  margin-top: auto;
}

.standard-card-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.33rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.standard-card-categories .tag {
  border: none;
  cursor: default;
  width: auto !important;
}

.standard-card-categories .tag.active {
  background-color: var(--wp--preset--color--secondary-brand); 
  color: var(--wp--preset--color--white);
}

.standard-status {
  align-self: flex-end;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
}

.standard-status--green {
  background-color: #d9f2df;
  color: #145c27;
}

.standard-status--red {
  background-color: #f8d9d9;
  color: #8d1717;
}

.standard-status--yellow {
  background-color: #fff0bf;
  color: #624b00;
}

.clear-filters {
  background: unset;
  border: unset;
  border-radius: 0.5rem;
  color: var(--wp--preset--color--secondary-brand);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0 0.25rem;
  padding: 0.33rem 0.35rem 1.45rem;
  text-decoration: underline;
}

.clear-filters:disabled {
  cursor: default;
  opacity: 0.6;
}

.clear-filters:not(:disabled):hover,
.clear-filters:not(:disabled):focus-visible {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: 2px;
  text-decoration: none;
}

.standards-filter-status {
  padding: 2rem 0;
}

.num-available {
  color: #666;
  font-size: .9rem;
  text-align: right;
  padding: 0 1rem .5rem;
  width: 96%;
}

.no-results {
  color: var(--wp--preset--color--foreground);
  padding: 3rem 0.66rem 0;
  text-align: center;
}
</style>
