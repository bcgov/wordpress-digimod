<template>
  <div v-if="uniqueTags.length > 1" class='tag-filter-container'>
    <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;">
      <div v-for="tag, index in uniqueTags" :key="tag" class="tag-checkbox">
        <input type="checkbox" :id="'tag-' + index" :value="tag" v-model="selectedTags" class="tag-input" />
        <label :for="tag" class="tag-label tag" tabindex="0" @click="checkTag(index)"
          @keydown.enter.prevent="checkTag(index)" role="button" :aria-label="getTagAriaLabel(tag)">
          {{ tag }}
        </label>

      </div>
      <button class="clear-filters" @click="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters</button>
      <span class='num-available'>{{ filteredPosts.length }} of {{ posts.length }} showing</span>
    </div>
  </div>

  <div v-if="filteredPosts.length > 0" class="alignfull wp-block-columns card-container">
    <div class="wp-block-query wcag-card-container">
      <ul class="is-flex-container wp-block-post-template" :class="`columns-${columns}`">

        <li v-for="post in filteredPosts" :key="post.id" class="filter-card common-component">

          <a :href="post.acf.card_hyperlink.value" class="card-title-link">
            <div
              class="wcag-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background">

              <h3 style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                class="has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title">
                {{ post.title.rendered }}</h3>

              <p style="font-size:1rem;"><span
                  class="value">
                  {{ post.acf.description.value }}
                </span></p>

              <div v-if="post.wcag_tag" class="taxonomy-common_component_category wp-block-post-terms wcag-card-tags">
                <span v-for="tag in post.wcag_tag" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <p v-else-if="showMessage" class="no-results" v-show="showMessage" aria-live='polite'>Oops, no {{ postType }} results found. <a href="#" @click.prevent="clearFilters" @keydown.enter.prevent='clearFilters'>Try resetting your filters</a> and refining your selections.</p>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';

  const postType = ref('');
  const posts = ref([]);
  const selectedTags = ref([]);
  const cssClass = ref('');
  const columns = ref(3);
  const showMessage = ref(false);

  const fetchData = async () => {
    const url = `/wp-json/wp/v2/${postType.value}?_embed&per_page=100`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('An error has occurred: ' + response.status);
      }
      const postsData = await response.json();
      posts.value = postsData.map((post) => ({
        ...post,
        wcag_tag: post._embedded?.['wp:term']?.flatMap((term) => term.map((t) => t.name)) || [],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const checkTag = (index) => {
    const tag = uniqueTags.value[index];
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag);
    } else {
      selectedTags.value.push(tag);
    }
  };

  const getTagAriaLabel = (tag) => {
    return `${tag} filter ${selectedTags.value.includes(tag) ? 'selected' : 'deselected'}`;
  };

  const clearFilters = () => {
    selectedTags.value = [];
  };

  const uniqueTags = computed(() => [...new Set(posts.value.flatMap((post) => post.wcag_tag || []))]);
  const filteredPosts = computed(() => {
    if (!selectedTags.value.length) {
      return posts.value;
    } else {
      return posts.value.filter((post) =>
        post.wcag_tag && post.wcag_tag.length && selectedTags.value.every((tag) => post.wcag_tag.includes(tag))
      );
    }
  });

  onMounted(() => {


    const appElement = document.getElementById('app');
    cssClass.value = appElement.getAttribute('class');
    columns.value = parseInt(appElement.getAttribute('data-columns'));
    postType.value = appElement.getAttribute('data-post-type');

    fetchData();

    setTimeout(() => {
      showMessage.value = true;
    }, 3000);
  });
</script>

<style scoped>
.tag-filter-container {
  margin: 2rem 0.33rem 2rem 0;
  display: flex;
}

.tag-checkbox {
  margin-bottom: .25rem;
}

.tag.tag-label {
  padding: 0.33rem 0.66rem;
}

.tag.tag-label:focus-visible,
.tag.tag-label:hover {
  background-color: #fcfcfc;
  color: var(--wp--preset--color--primary-brand);
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: 0px;
}

.tag-input:checked+.tag {
  background-color: #dfe7ed;
  color: #000;
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: -1px;
}

.card-title-link:hover {
  outline: 0 !important;
  border-radius: 1rem !important;
}

.card-title-link:hover .wcag-card-content {
  outline: 2px solid var(--wp--preset--color--primary-brand);
}

.clear-filters {
  background: unset;
  border: unset;
  border-radius: 1rem;
  color: var(--wp--preset--color--secondary-brand);
  cursor: pointer;
  padding: 0.33rem 0.66rem;
  margin: 0 0.33rem;
  overflow: hidden;
  font-size: 1rem;
}
.clear-filters:hover,
.clear-filters:focus-visible {
  outline: 2px solid var(--wp--preset--color--gray-80);
  outline-offset: 0px;
  background-color: #fcfcfc;
}

.filter-card {
  border-radius: 1rem;
}

.no-results {
  color: var(--wp--preset--color--primary-brand);
  padding: 0.66rem;
}

.no-results a {
  color: #8b0000;
}

.num-available {
  color: #666;
  font-size: 0.9rem;
}

.wcag-card-content {
  border-radius: 1rem !important;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.wcag-card-content > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.wcag-card-tags {
  margin-top: auto;
}
</style>