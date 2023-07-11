<template>
  <div class='tag-filter-container'>
    <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;">
      <div v-for="tag, index in uniqueTags" :key="tag" class="tag-checkbox">
        <input type="checkbox" :id="'tag-' + index" :value="tag" v-model="selectedTags" class="tag-input" />
        <label :for="tag" class="tag-label tag" tabindex='0' @click="checkTag(index)" @keydown.enter.prevent="checkTag(index)">{{ tag }}</label>
      </div>
    </div>

    <button class="clear-filters" @click="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters</button>

  </div>

  <div class="alignfull wp-block-columns card-container">
    <div class="wp-block-query wcag-card-container">
      <ul class="is-flex-container wp-block-post-template" :class="`columns-${this.columns}`">

        <li v-for="post in filteredPosts" :key="post.id" class="filter-card common-component">

          <a :href="post.acf.card_hyperlink.value" class="card-title-link">
            <div
              class="wcag-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background">

              <h3 style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                class="has-text-color has-secondary-brand-color is-style-_ h1-heading is-style-default wp-block-post-title card-title">
                {{ post.title.rendered }}</h3>

              <p style="font-size:1rem;"
                class="wp-elements-ebf6029de9e8cfc5d6fe4a760bc46921 is-acf-field wp-block-mfb-meta-field-block"><span
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
</template>

<style scoped>

.tag-filter-container {
  margin: 2rem 0;
}
.tag.tag-label {
  padding: 0.33rem 0.66rem;
}

.tag.tag-label:focus-visible,
.tag.tag-label:hover {
  outline: 2px solid var(--wp--preset--color--primary-brand);
}
.tag-input:checked + .tag {
  background-color: var(--wp--preset--color--gray-40);
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
.clear-filters:focus-visible {
  outline: 2px solid var(--wp--preset--color--primary-brand);
}
.filter-card {
  border-radius: 1rem;
}

.wcag-card-content {
  border-radius: 1rem !important;
  padding-top: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  padding-left: 2rem
}
</style>

<script>
export default {
  data() {
    return {
      posts: [], // API response goes here
      selectedTags: [],
      cssClass: '',
      columns: 3,
    };
  },
  computed: {
    uniqueTags() {
      let uniqueT = [...new Set(this.posts.flatMap(post => post.wcag_tag || []))];
      console.log('uniqueTags: ', uniqueT);
      return uniqueT;
    },

    filteredPosts() {

      // return posts;
      if (!this.selectedTags.length) {
        return this.posts;
      } else {
        return this.posts.filter(post => {
          return post.wcag_tag && post.wcag_tag.length && this.selectedTags.every(tag => post.wcag_tag.includes(tag));
        });
      }
    },
  },

  created() {
    // Fetch data from API when component is created
    this.fetchData();

    const appElement = document.getElementById('app');
    this.cssClass = appElement.getAttribute('class');
    this.columns = parseInt(appElement.getAttribute('data-columns'));
    console.log('created: ', this.columns, this.cssClass);
  },

  methods: {
    async fetchData() {
      const url = '/wp-json/wp/v2/wcag-card?_embed&per_page=200'; // More than enough for the WCAG guidelines
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("An error has occurred: " + response.status);
        }
        let posts = await response.json();
        console.log('posts: ', posts)

        // Replace tag ids with tag names in posts
        posts.forEach(post => {
          console.log('processing post/post.wcag_tag: ', post, post.wcag_tag)
          // post.wcag_tag = post.wcag_tag ? post.wcag_tag.map(tagId => tags[tagId] || tagId) : [];
          post.wcag_tag = (post._embedded && post._embedded["wp:term"]) ? post._embedded["wp:term"].flatMap(term => term.map(t => t.name)) : [];
        });

        this.posts = posts;

        console.log('setting this.posts: ', this.posts);

      } catch (error) {
        console.log(error);
      }
    },
    checkTag(index) {
      const tag = this.uniqueTags[index];
      const indexOfTag = this.selectedTags.indexOf(tag);
      if (indexOfTag > -1) {
        this.selectedTags.splice(indexOfTag, 1);
      } else {
        this.selectedTags.push(tag);
      }
    },
    clearFilters() {
      this.selectedTags = [];
    },
  },
};
</script>
