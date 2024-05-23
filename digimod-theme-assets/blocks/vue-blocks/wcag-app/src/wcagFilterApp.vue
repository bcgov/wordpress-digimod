<template>
  <div v-if="uniqueTags.length > 0" class='tag-filter-container'>
    <div role='heading' id="id-group-label" class='sr-only' aria-hidden='true'>Filterable categories</div>
    <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;" role="group"
      aria-labelledby="id-group-label">
      <template v-for="tag, index in uniqueTags">
        <div class="tag-checkbox">
          <input type="checkbox" :id="'tag-' + index" :value="tag" v-model="selectedTags" class="tag-input" />
          <label :for="tag" class="tag-label tag" tabindex="0" @click="checkTag(index)"
            @keydown.space.enter.prevent="checkTag(index)" @keydown="handleKeyNavigation($event, index)" role="checkbox"
            :aria-label="getTagAriaLabel(tag)" :aria-checked="getTagAriaChecked(tag)">
            {{ tag }}
          </label>
        </div>
      </template>
      <div class="tag-checkbox">
        <button class="tag clear-filters" @click="clearFilters" @keydown.enter.prevent='clearFilters'
          aria-label='Show all filterable content. Removes previously set filter options.'>Show all</button>
      </div>
    </div>
  </div>
  <div v-if="filteredPosts.length > 0" class='num-available'>{{ filteredPosts.length }} of {{ posts.length }} results
    showing</div>
  <div v-if="filteredPosts.length > 0" class="wp-block-columns card-container">
    <div class="wp-block-query wcag-card-container">
      <ul class="is-flex-container wp-block-post-template" :class="`columns-${columns}`">

        <li v-for="post in filteredPosts" :key="post.id" class="filter-card common-component">

          <a :href="post.acf.card_hyperlink ? post.acf.card_hyperlink.value : post.link" class="card-title-link">
            <div
              class="wcag-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background">

              <h3 style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                class="has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title"
                v-html="post.title.rendered"></h3>

              <p v-if="undefined !== post.acf.success_criteria_number && post.acf.success_criteria_number.value"
                class="has-text-color has-secondary-brand-color" style="margin-block:1rem 0; font-size:1rem">Success
                criterion {{ post.acf.success_criteria_number.value }}
                <span
                  v-if="undefined !== post.acf.success_criteria_level && 'null' !== post.acf.success_criteria_level.value">(Level
                  {{ post.acf.success_criteria_level.value }})</span>
              </p>

              <p v-if="post.acf.team_name_ministry" style="margin-top:0;">{{ post.acf.team_name_ministry.value }}
              </p>

              <p style="font-size:1rem;"><span class="value">
                  {{ post.acf.short_description ? post.acf.short_description.value : post.acf.description.value
                  }}
                </span></p>
              <div role='heading' id="id-tag-group-label" class='sr-only'>Applicable filter categories</div>
              <ul v-if="post.wcag_tag" class="taxonomy-common_component_category wp-block-post-terms wcag-card-tags">
                <template v-for="tag in post.wcag_tag" :key="tag">
                  <li v-if='tag !== "Active"' :class="{ 'tag': true, 'active': selectedTags.includes(tag) }">{{ tag
                    }}</li>
                </template>
              </ul>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <p v-else-if="showMessage" class="no-results" v-show="showMessage" aria-live='polite'><strong>No results
      found.</strong><br /><a href="#" @click.prevent="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters
      and try again</a>.</p>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const postType = ref('');
const postTypeLabel = ref('');
const posts = ref([]);
const selectedTags = ref([]);
const cssClass = ref('');
const columns = ref(3);
const showMessage = ref(false);
const allTagSelected = ref(true);

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
    }))
      .slice()
      .sort((a, b) => (a.title.rendered > b.title.rendered) ? 1 : -1);;
  } catch (error) {
    console.error(error);
  }
};

const checkTag = (index) => {

  const tag = uniqueTags.value[index];
  // console.log('tag:', tag);
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const handleKeyNavigation = (event, index) => {
  const labels = document.querySelectorAll('.tag-label');

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

  // const focusNext = () => {
  //   if (index === labels.length) {
  //     labels[0].focus();
  //   } else if (index >= 0) {
  //     labels[index].focus();
  //   } 
  // };

  // const focusPrev = () => {
  //   if (index === 1) {
  //     labels[labels.length - 1].focus();
  //   } else if (index > 1) {
  //     labels[index - 2].focus();
  //   }
  // };

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

// const checkTag = (index) => {
//   const tag = uniqueTags.value[index];
//   console.log('tag:', tag);

//   // Check if all selected tags are present
//   const allSelectedTagsPresent = selectedTags.value.every(selectedTag => uniqueTags.value.includes(selectedTag));

//   // Toggle the selection based on "and" condition
//   if (allSelectedTagsPresent) {
//     // Remove the tag if all selected tags are already present
//     selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag);
//   } else {
//     // Add the tag if it ensures all selected tags are present
//     selectedTags.value.push(tag);
//   }
// };

const getTagAriaLabel = (tag) => {
  return `${tag} filter ${selectedTags.value.includes(tag) ? 'selected' : 'deselected'}`;
};

const getTagAriaChecked = (tag) => {
  return `${selectedTags.value.includes(tag) ? 'true' : 'false'}`;
};



const clearFilters = () => {
  selectedTags.value = [];
};

const uniqueTags = computed(() => [...new Set(posts.value.flatMap((post) => post.wcag_tag || []).filter(tag => tag !== "Active").sort())]); // Remove the Active category so it does not interfere with arrow navigation
const filteredPosts = computed(() => {
  if (!selectedTags.value.length) {
    return posts.value;
  } else {
    // console.log('posts:', posts);
    return posts.value
      .filter((post) =>
        post.wcag_tag && post.wcag_tag.length && selectedTags.value.some((tag) => post.wcag_tag.includes(tag))
      )
      .slice()
      .sort((a, b) => (a.title.rendered > b.title.rendered) ? 1 : -1);
  }
});

onMounted(() => {

  const appElement = document.getElementById('app');
  cssClass.value = appElement.getAttribute('class');
  columns.value = parseInt(appElement.getAttribute('data-columns'));
  postType.value = appElement.getAttribute('data-post-type');
  postTypeLabel.value = appElement.getAttribute('data-post-type-label');

  fetchData();

  setTimeout(() => {
    showMessage.value = true;
  }, 3000);
});
</script>

<style scoped>
.tag-filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 2rem 0.33rem 0.5rem 0;
  width: 100%;
}

.tag-filter-container>span {
  position: relative;
  right: 0;
}

.tag-checkbox {
  margin-bottom: .33rem;
}

.tag.tag-label {
  padding: 0.33rem 0.66rem;
}

.tag.tag-label:focus-visible,
.tag.tag-label:hover,
.tag-input:checked+.tag:focus-visible,
.tag-input:checked+.tag:hover {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  outline: 2px solid var(--wp--preset--color--white);
  outline-offset: -4px;
}

.tag-input:checked+.tag {
  color: var(--wp--preset--color--white);
  background-color: var(--wp--preset--color--secondary-brand);
  border: 2px solid var(--wp--preset--color--primary-brand);
  padding: calc(0.33rem - 1px) calc(0.66rem - 1px);
}

.card-title-link:is(:hover, :focus-visible) {
  outline: 0 !important;
  border-radius: 1rem !important;
}

.card-title-link:is(:hover, :focus-visible) .wcag-card-content {
  outline: 2px solid var(--wp--preset--color--primary-brand);
}

.clear-filters {
  background: unset;
  border: unset;
  border-radius: 0.5rem;
  color: var(--wp--preset--color--secondary-brand);
  cursor: pointer;
  padding: .33rem .35rem 1.45rem;
  margin: 0 0 0 0.25rem;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
}

.clear-filters:hover,
.clear-filters:focus-visible {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: 2px;
  text-decoration: none;
}

.filter-card {
  border-radius: 1rem;
}

.no-results {
  color: var(--wp--preset--color--foreground);
  padding: 3rem 0.66rem 0;
  text-align: center;
}

.no-results::before {
  display: block;
  content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA3NjUgNzQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTg4LjA5IDM3NC4wNTNDNTg4LjA5IDQ5OS4xNDggNDg2LjY4IDYwMC41NTggMzYxLjU4NSA2MDAuNTU4QzIzNi40OSA2MDAuNTU4IDEzNS4wOCA0OTkuMTQ4IDEzNS4wOCAzNzQuMDUzQzEzNS4wOCAyNDguOTU4IDIzNi40OSAxNDcuNTQ4IDM2MS41ODUgMTQ3LjU0OEM0ODYuNjggMTQ3LjU0OCA1ODguMDkgMjQ4Ljk1OCA1ODguMDkgMzc0LjA1M1oiIGZpbGw9IiNGNUY1RjUiLz4KPHBhdGggZD0iTTU4OC4wOSAzNzQuMDUzQzU4OC4wOSA0OTkuMTQ4IDQ4Ni42OCA2MDAuNTU4IDM2MS41ODUgNjAwLjU1OEMyMzYuNDkgNjAwLjU1OCAxMzUuMDggNDk5LjE0OCAxMzUuMDggMzc0LjA1M0MxMzUuMDggMjQ4Ljk1OCAyMzYuNDkgMTQ3LjU0OCAzNjEuNTg1IDE0Ny41NDhDNDg2LjY4IDE0Ny41NDggNTg4LjA5IDI0OC45NTggNTg4LjA5IDM3NC4wNTNaIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTQ3LjA1MiAyMTIuNTA5VjIxMS45N0w1NDMuMTk3IDIxMi4wMThDNTUzLjUyOSAyMjQuOTIxIDU2Mi40NzggMjM4Ljk3OCA1NjkuODIgMjUzLjk2NUg2NzIuMjMyVjI1My43MTJDNzI0LjA4MSAyNTAuMjc5IDc2NC45NDYgMjExLjg3NCA3NjQuOTQ2IDE2NS4wMDRDNzY0Ljk0NiAxMjEuNTQ4IDcyOS44MiA4NS4zNzA3IDY4My4zODEgNzcuNTkyNUM2NzMuOTQ3IDMzLjMwODMgNjMzLjIxNSAwIDU4NC4zOTkgMEM1MzUuNTgyIDAgNDk0Ljg1IDMzLjMwODIgNDg1LjQxNiA3Ny41OTIzQzQ1MS42NjcgODMuMjQ1IDQyMy44OTMgMTAzLjg5NyA0MTEuMjM0IDEzMS40NDFDNDI1LjI2IDEzNC4yNjQgNDM4LjgxNiAxMzguMzgzIDQ1MS43NzQgMTQzLjY2N0M0NTkuMjA1IDEzMS43ODQgNDcyLjkxOCAxMjEuNzE5IDQ5Mi4yNjQgMTE4LjQ3OUw1MjAuMDg1IDExMy44MTlMNTI1Ljk2MiA4Ni4yMzAyQzUzMS4xOCA2MS43NDEzIDU1NC40NjggNDEuNDU2MSA1ODQuMzk5IDQxLjQ1NjFDNjE0LjMyOSA0MS40NTYxIDYzNy42MTggNjEuNzQxMyA2NDIuODM1IDg2LjIzMDNMNjQ4LjcxMiAxMTMuODE5TDY3Ni41MzMgMTE4LjQ3OUM3MDYuOTk2IDEyMy41ODEgNzIzLjQ4OSAxNDUuNjA0IDcyMy40ODkgMTY1LjAwNEM3MjMuNDg5IDE4NS44IDcwNC4wNjEgMjEwLjA1OCA2NjkuNDkzIDIxMi4zNDdMNjY3LjAzOCAyMTIuNTA5SDU0Ny4wNTJaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY1My4zNzMgNjYxLjYxNUw1MzYuMzc3IDU1Ni44MjNMNTY0LjAzNiA1MjUuOTQzTDY4MS4wMzIgNjMwLjczNUw2NTMuMzczIDY2MS42MTVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjk4LjcxNiAzODIuMzU4QzI5OC43MTYgMzk1LjE0NyAyODguMzQ4IDQwNS41MTUgMjc1LjU1OSA0MDUuNTE1QzI2Mi43NyA0MDUuNTE1IDI1Mi40MDIgMzk1LjE0NyAyNTIuNDAyIDM4Mi4zNThDMjUyLjQwMiAzNjkuNTY5IDI2Mi43NyAzNTkuMjAxIDI3NS41NTkgMzU5LjIwMUMyODguMzQ4IDM1OS4yMDEgMjk4LjcxNiAzNjkuNTY5IDI5OC43MTYgMzgyLjM1OFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0zODQuNzQyIDM4Mi4zNThDMzg0Ljc0MiAzOTUuMTQ3IDM3NC4zNzQgNDA1LjUxNSAzNjEuNTg1IDQwNS41MTVDMzQ4Ljc5NiA0MDUuNTE1IDMzOC40MjggMzk1LjE0NyAzMzguNDI4IDM4Mi4zNThDMzM4LjQyOCAzNjkuNTY5IDM0OC43OTYgMzU5LjIwMSAzNjEuNTg1IDM1OS4yMDFDMzc0LjM3NCAzNTkuMjAxIDM4NC43NDIgMzY5LjU2OSAzODQuNzQyIDM4Mi4zNThaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNNDcwLjc2OSAzODIuMzU4QzQ3MC43NjkgMzk1LjE0NyA0NjAuNDAxIDQwNS41MTUgNDQ3LjYxMiA0MDUuNTE1QzQzNC44MjMgNDA1LjUxNSA0MjQuNDU1IDM5NS4xNDcgNDI0LjQ1NSAzODIuMzU4QzQyNC40NTUgMzY5LjU2OSA0MzQuODIzIDM1OS4yMDEgNDQ3LjYxMiAzNTkuMjAxQzQ2MC40MDEgMzU5LjIwMSA0NzAuNzY5IDM2OS41NjkgNDcwLjc2OSAzODIuMzU4WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNDMuNjkyIDY4NS41NDRWNjg2LjA4M0gyNjMuNjc4TDI2Ni4xMzMgNjg1LjkyQzMwMC43IDY4My42MzEgMzIwLjEyOSA2NTkuMzczIDMyMC4xMjkgNjM4LjU3N0MzMjAuMTI5IDYxOS4xNzcgMzAzLjYzNiA1OTcuMTU1IDI3My4xNzIgNTkyLjA1M0wyNDUuMzUyIDU4Ny4zOTNMMjM5LjQ3NCA1NTkuODA0QzIzNC4yNTcgNTM1LjMxNSAyMTAuOTY5IDUxNS4wMyAxODEuMDM4IDUxNS4wM0MxNTEuMTA3IDUxNS4wMyAxMjcuODE5IDUzNS4zMTUgMTIyLjYwMiA1NTkuODA0TDExNi43MjUgNTg3LjM5M0w4OC45MDQxIDU5Mi4wNTNDNTguNDQwNyA1OTcuMTU1IDQxLjk0NzMgNjE5LjE3NyA0MS45NDczIDYzOC41NzdDNDEuOTQ3MyA2NjAuMjgxIDYzLjQ3NTkgNjg2LjA3OSAxMDAuNzc3IDY4Ni4wNzlDMTAxLjA4OCA2ODYuMDc5IDEwMS40IDY4Ni4wNzcgMTAxLjcxMiA2ODYuMDczTDE0My42OTIgNjg1LjU0NFpNMjY4Ljg3MiA3MjcuMjg2VjcyNy41MzlIMTAyLjIzNVY3MjcuNTI2QzEwMS43NSA3MjcuNTMyIDEwMS4yNjQgNzI3LjUzNSAxMDAuNzc3IDcyNy41MzVDMTAwLjI4OSA3MjcuNTM1IDk5LjgwMzIgNzI3LjUzMiA5OS4zMTc3IDcyNy41MjZDNDQuNjA0MiA3MjYuODM0IDAuNDkxMjExIDY4Ny4yNzUgMC40OTEyMTEgNjM4LjU3N0MwLjQ5MTIxMSA1OTUuMTIyIDM1LjYxNjcgNTU4Ljk0NCA4Mi4wNTYgNTUxLjE2NkM5MS40OTAyIDUwNi44ODIgMTMyLjIyMSA0NzMuNTc0IDE4MS4wMzggNDczLjU3NEMyMjkuODU1IDQ3My41NzQgMjcwLjU4NiA1MDYuODgyIDI4MC4wMjEgNTUxLjE2NkMzMjYuNDYgNTU4Ljk0NCAzNjEuNTg1IDU5NS4xMjIgMzYxLjU4NSA2MzguNTc3QzM2MS41ODUgNjg1LjQ0OCAzMjAuNzIxIDcyMy44NTMgMjY4Ljg3MiA3MjcuMjg2WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMDUuNTMxIDIyMS44NzNDMTM2LjMxOSAyOTEuMDg1IDEyMi42NjEgMzk0Ljg3NSAxNjQuNjY5IDQ3Ny43MjNMMTI3LjY5NSA0OTYuNDcxQzc3LjgxODcgMzk4LjEwNSA5My45NTU0IDI3NC44MjEgMTc2LjIxNyAxOTIuNTU5QzI3OC41OTMgOTAuMTgzMSA0NDQuNTc4IDkwLjE4MzEgNTQ2Ljk1NCAxOTIuNTU5QzY0OS4zMzEgMjk0LjkzNiA2NDkuMzMxIDQ2MC45MjEgNTQ2Ljk1NCA1NjMuMjk3QzQ4OS42MjEgNjIwLjYzIDQxMi4zMTIgNjQ1Ljg0NyAzMzcuNDgyIDYzOC45NzVMMzQxLjI3MyA1OTcuNjkzQzQwNC4zNjQgNjAzLjQ4NiA0NjkuMzgzIDU4Mi4yNDEgNTE3LjY0MSA1MzMuOTgzQzYwMy44MjcgNDQ3Ljc5NiA2MDMuODI3IDMwOC4wNiA1MTcuNjQxIDIyMS44NzNDNDMxLjQ1NCAxMzUuNjg3IDI5MS43MTggMTM1LjY4NyAyMDUuNTMxIDIyMS44NzNaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4=);
}

.no-results a {
  color: var(--wp--preset--color--secondary-brand);
  font-size: 1.05rem;
}

.no-results strong {
  font-size: 1.5rem;
}

.num-available {
  color: #666;
  font-size: 0.9rem;
  text-align: right;
  padding: 0 1rem 0.5rem;
  width: 96%;
}

.wcag-card-content {
  border-radius: 1rem !important;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.wcag-card-content>* {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.wcag-card-tags {
  margin-top: auto;
}
</style>