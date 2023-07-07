<template>

  <div class="wp-container-13" style="padding-bottom:var(--wp--preset--spacing--20);">      
      <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;">
        <div v-for="tag in uniqueTags" :key="tag" class="tag-checkbox">
          <input type="checkbox" :id="tag" :value="tag" v-model="selectedTags" class="tag-input" />
          <label :for="tag" class="tag-label tag">{{ tag }}</label>
        </div>
      </div>

      <!-- <div class="wp-block-button has-size-regular has-custom-font-size has-small-font-size">
        <button @click="clearFilters" tabindex="0" class="wp-block-button__link wp-element-button wcag-reset-button">Clear All Filters</button>
      </div> -->

      <h3 class="clearFilters" @click="clearFilters" style="color: var(--wp--preset--color--secondary-brand); cursor: pointer; padding-left: 10px; overflow: hidden; font-size: 1rem; padding-top: 3px;">Clear All Filters</h3>

  </div>

  <div class="is-layout-constrained wp-container-38 wp-block-group alignfull card-container"
    style="padding-top:0;padding-bottom:var(--wp--preset--spacing--50);">
    <div class="is-layout-flow wp-block-query wcag-card-container">
      <ul class="is-layout-flow is-flex-container wp-block-post-template" :class="`columns-${this.columns}`">

        <li v-for="post in filteredPosts" :key="post.id"
          class="filter-card post-5655 common-component type-common-component status-publish hentry common_component_category-active common_component_category-established common_component_category-identity common_component_category-service">

          <a  :href="post.acf.card_hyperlink.value">
            <div
              class="wcag-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background"
              style="border-radius:1rem;padding-top:2rem;padding-right:2rem;padding-bottom:2rem;padding-left:2rem">
              

              <h3 style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                class="has-text-color has-secondary-brand-color is-style-_ h1-heading is-style-default wp-block-post-title">
                {{ post.title.rendered }}</h3>

              <!-- <p style="margin-top:0;" class="is-acf-field wp-block-mfb-meta-field-block has-small-font-size"><span
                    class="value">Office of the Chief Information Officer</span></p> -->

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
      <!-- <div v-for="post in filteredPosts" :key="post.id" class="card">
        <h3>{{ post.title.rendered }}</h3>
        <p>{{ post.acf.test }}</p>
        <p>Tags: {{ post.tags.join(', ') }}</p>
      </div> -->
    </div>
  </div>

</template>

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
      clearFilters() {
        // console.log('clearFilters: ', this.selectedTags)
        this.selectedTags = [];
        // console.log('clearFilters 2: ', this.selectedTags)
      },

      uniqueTags() {
        let uniqueT = [...new Set(this.posts.flatMap(post => post.wcag_tag || []))];
        console.log('uniqueTags: ', uniqueT);
        return uniqueT;
      },

      filteredPosts() {
        // let posts = this.posts;

        // // If tags are selected, filter posts
        // if (this.selectedTags.length > 0) {
        //   posts = posts.filter(post =>
        //     this.selectedTags.every(tag => post.tags.includes(tag))
        //   );
        // }

        // // Sort posts by title
        // posts.sort((a, b) => a.title.rendered.localeCompare(b.title.rendered));

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
        const url = '/wp-json/wp/v2/wcag-card?_embed'; // Replace with your API URL
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("An error has occurred: " + response.status);
          }
          let posts = await response.json();
          console.log('posts: ', posts)
          
          // Get the unique URLs for fetching tags
          // const tagUrls = [...new Set(posts.flatMap(post => post._links['wp:term'].map(link => link.href)))];

          // console.log('tagUrls: ', tagUrls);

          // // Fetch tags from each unique URL and store the response
          // let tags = {};
          // for (const tagUrl of tagUrls) {
          //   const tagResponse = await fetch(tagUrl);
          //   if (tagResponse.ok) {
          //     const tagData = await tagResponse.json();
          //     // Map each tag id to its name
          //     tagData.forEach(tag => {
          //       tags[tag.id] = tag.name
          //     });
          //   }
          // }
          
          // console.log('tags: ', tags);

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
    },
  };
</script>
