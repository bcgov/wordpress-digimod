<template>
  <div v-if="uniqueTags.length > 1" class='tag-filter-container'>
    <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;">
      <div v-for="tag, index in uniqueTags" :key="tag" class="tag-checkbox">
        <template v-if='tag !== "Active"'>
          <input type="checkbox" :id="'tag-' + index" :value="tag" v-model="selectedTags" class="tag-input" />
          <label :for="tag" class="tag-label tag" tabindex="0" @click="checkTag(index)"
            @keydown.enter.prevent="checkTag(index)" role="button" :aria-label="getTagAriaLabel(tag)">
            {{ tag }}
          </label>
        </template>
      </div>
      <button class="clear-filters" @click="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters</button>
    </div>
  </div>
  <div v-if="filteredPosts.length > 0" class='num-available'>{{ filteredPosts.length }} of {{ posts.length }} results showing</div>
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

              <p v-if="post.acf.team_name_ministry" style="margin-top:0;">{{ post.acf.team_name_ministry.value }}
              </p>

              <p style="font-size:1rem;"><span class="value">
                  {{ post.acf.short_description ? post.acf.short_description.value : post.acf.description.value
                  }}
                </span></p>
              <div v-if="post.wcag_tag" class="taxonomy-common_component_category wp-block-post-terms wcag-card-tags">
                <template v-for="tag in post.wcag_tag" :key="tag">
                  <span v-if='tag !== "Active"' class="tag">{{ tag }}</span>
                </template>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <p v-else-if="showMessage" class="no-results" v-show="showMessage" aria-live='polite'><strong>No results found.</strong><br/><a href="#" @click.prevent="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters and try again</a>.</p>
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

const uniqueTags = computed(() => [...new Set(posts.value.flatMap((post) => post.wcag_tag || []).sort())]);
const filteredPosts = computed(() => {
  if (!selectedTags.value.length) {
    return posts.value;
  } else {
    console.log('posts:', posts);
    return posts.value
      .filter((post) =>
        post.wcag_tag && post.wcag_tag.length && selectedTags.value.every((tag) => post.wcag_tag.includes(tag))
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

.tag-filter-container > span {
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
  color: #dfe7ed;
  outline: 2px solid var(--wp--preset--color--white);
  outline-offset: -4px;
}

.tag-input:checked+.tag {
  color: #dfe7ed;
  background-color: var(--wp--preset--color--secondary-brand);
  border: 2px solid var(--wp--preset--color--primary-brand);
  padding: calc(0.33rem - 1px) calc(0.66rem - 1px);
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
  border-radius: 0.5rem;
  color: var(--wp--preset--color--secondary-brand);
  cursor: pointer;
  padding: 0.33rem 0.66rem 0.5rem;
  margin: 0;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  position: relative;
  top: -2px;
}

.clear-filters:hover,
.clear-filters:focus-visible {
  background-color: var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--white);
}

.filter-card {
  border-radius: 1rem;
}

.no-results {
  color: var(--wp--preset--color--primary-brand);
  padding: 0.66rem;
  text-align: center;
}
.no-results::before {
  display: block;
  content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNTQiIHZpZXdCb3g9IjAgMCA1MTMgNTEyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI4Ni41OTkgMS40ODU5M0MyNDguNjc2IDYuNjI5OTMgMjExLjcyMiAyMi44ODU5IDE4My4zMDEgNDYuOTI2OUwxNzYuMDAzIDUzLjEwMDlMMTcwLjgwMSA0OS41Mzg5QzE2NC4yOTYgNDUuMDg1OSAxNTguNDAyIDQyLjk4NzkgMTUwLjIxOSA0Mi4yMTI5QzE0NC4zOTEgNDEuNjYxOSAxNDMuNDY5IDQxLjIzOTkgMTM5LjU3NyAzNy4zNDg5QzEyOS44ODkgMjcuNjYwOSAxMTYuMDExIDIxLjIxNTkgMTAyLjY2NCAyMC4yMDU5Qzc2LjA0MjggMTguMTkyOSA1MC44MjY4IDM1LjQ5MzkgNDIuOTczOCA2MS4xNTk5QzQwLjk3ODggNjcuNjc5OSA0MC43Nzg4IDY3LjkzMTkgMzYuNzYwOCA2OS4wMTM5QzI3LjAwNTggNzEuNjQwOSAxOC45Nzg4IDc4LjM5NjkgMTQuMzAzOCA4Ny45MTU5QzEwLjcwOTggOTUuMjMyOSAxMC40ODM4IDEwNy44MTIgMTMuODEzOCAxMTUuMTRDMTYuODA0OCAxMjEuNzIyIDI0LjMxNTggMTI5LjM5MSAzMC45NzM4IDEzMi42NjFMMzYuNTk4OCAxMzUuNDIzTDc5LjQ1NDggMTM1LjcxNEMxMTkuMzMyIDEzNS45ODQgMTIyLjI3NiAxMzYuMTIzIDEyMS44MDYgMTM3LjcxNEMxMTUuMyAxNTkuNzM0IDExMy4wODIgMTcyLjc1NCAxMTIuMzk5IDE5Mi45MjNDMTExLjU0MyAyMTguMjM4IDExNC40MTYgMjM4LjY3NSAxMjIuMTkyIDI2Mi41ODdDMTI2LjI1NCAyNzUuMDc1IDEzNS4zNTQgMjk0LjcyOCAxNDEuNTg1IDMwNC40NjhDMTQzLjUxOCAzMDcuNDkgMTQ1LjA5OSAzMTAuMTI1IDE0NS4wOTkgMzEwLjMyNEMxNDUuMDk5IDMxMC41MjQgMTE0LjY0MyAzMzkuODc4IDc3LjQxODggMzc1LjU1NUM0MC4xOTM4IDQxMS4yMzIgOC40NTA4NCA0NDIuNDQ4IDYuODc2ODQgNDQ0LjkyM0MyLjE3MTg0IDQ1Mi4zMjMgLTAuMjMwMTU3IDQ2MS44MTkgMC4zNDI4NDMgNDcwLjc1OUMxLjE5Njg0IDQ4NC4wOTggNi4zMTU4NCA0OTMuOTk2IDE2Ljc2NzggNTAyLjUxN0MyNi4yNzU4IDUxMC4yNjcgNDEuMjQ1OCA1MTMuNzE5IDUzLjI0NDggNTEwLjkyN0M2Ni4zMDk4IDUwNy44ODYgNjUuNDM4OSA1MDguNjg0IDEzNS45MDYgNDM1LjE5QzE3MS45MDcgMzk3LjY0MyAyMDEuNTE5IDM2Ni45MjMgMjAxLjcxMSAzNjYuOTIzQzIwMS45MDMgMzY2LjkyMyAyMDQuNjQ4IDM2OC41NzggMjA3LjgxIDM3MC42MDFDMjE3LjAxMSAzNzYuNDg3IDIzOC42NjcgMzg2LjQyOSAyNTAuNjQxIDM5MC4yNjRDMjczLjY3MSAzOTcuNjQgMjk0LjMwOSA0MDAuNDYyIDMxOS4wOTkgMzk5LjYyM0MzNDYuMzQ3IDM5OC43MDEgMzY5LjQzMSAzOTMuNDkxIDM5Mi41OTkgMzgzLjAzNEw0MDAuNTk5IDM3OS40MjNMNDQ0LjU5OSAzNzguOTIzTDQ4OC41OTkgMzc4LjQyM0w0OTMuODE2IDM3NS42NzNDNTAwLjQ0NyAzNzIuMTc4IDUwNS4zNjIgMzY3LjI1OSA1MDguODQgMzYwLjY0QzUxMS4yMzggMzU2LjA3NSA1MTEuNTgxIDM1NC4yOTggNTExLjU4MSAzNDYuNDIzQzUxMS41ODEgMzM4LjUyMSA1MTEuMjQyIDMzNi43NzggNTA4LjgwNiAzMzIuMTM5QzUwNS4zMjcgMzI1LjUxNCA0OTkuNzM5IDMyMC4wMzQgNDkzLjQ1NiAzMTcuMDg2QzQ4OS4zMTcgMzE1LjE0MyA0ODguMjA1IDMxMy45NyA0ODUuOTM0IDMwOS4xNDRMNDgzLjI2OSAzMDMuNDgxTDQ4Ny4xMzYgMjk2Ljg2QzQ5NS40NDMgMjgyLjYzNiA1MDMuMjAzIDI2Mi4wMTIgNTA3LjQ0NiAyNDIuODg0QzUyMC41NDYgMTgzLjgyNCA1MDUuNzQ2IDEyMS40MTcgNDY3LjM3OCA3My45MjI5QzQ2MC4yMjcgNjUuMDcwOSA0NDMuMDg1IDQ4LjI2MDkgNDM0LjU5OSA0MS43Nzk5QzQwNS4xOTcgMTkuMzIzOSAzNzAuMDczIDUuMTMwOTMgMzMzLjU5OSAwLjk2NjkzQzMyMS40NDMgLTAuNDIxMDcgMjk4LjgxMiAtMC4xNzEwNyAyODYuNTk5IDEuNDg1OTNaTTI5My4xNTMgMjEuMDcwOUMyODguNTA4IDIxLjU1NTkgMjc5LjU0MyAyMy4xMTA5IDI3My4yMzIgMjQuNTI1OUMyMDQuODUyIDM5Ljg2MjkgMTUxLjk3NiA5Mi43MjU5IDEzNi43MjUgMTYxLjAwMkMxMjQuMzMyIDIxNi40ODEgMTM4LjkwNiAyNzMuODU5IDE3Ni41OTkgMzE3Ljk4NEMyMTEuMTk4IDM1OC40ODcgMjY3LjQ0NiAzODIuNDMgMzIwLjk4OCAzNzkuNDQ1QzMzNi4xOTcgMzc4LjU5NyAzMzcuNDM3IDM3OC4yMDIgMzMyLjIyMyAzNzUuODY3QzMyNy41MzkgMzczLjc3IDMxOS41NCAzNjYuNjc3IDMxNy41NzYgMzYyLjg3OUMzMTYuMjM3IDM2MC4yODkgMzE1Ljk0NSAzNjAuMjIgMzAzLjkwMyAzNTkuNjQ5QzI4MS40ODkgMzU4LjU4NyAyNjEuMjYzIDM1My4yMjkgMjQwLjU5OSAzNDIuODhDMTk2LjQxNSAzMjAuNzUyIDE2NS42MjQgMjgwLjQ5OCAxNTQuOTYgMjMwLjkyM0MxNTMuMDMgMjIxLjk1MSAxNTIuNzAyIDIxNy40MzkgMTUyLjcwMiAxOTkuOTIzQzE1Mi43MDIgMTgyLjQwNyAxNTMuMDMgMTc3Ljg5NSAxNTQuOTYgMTY4LjkyM0MxNTcuNzQzIDE1NS45ODggMTYyLjAwNyAxNDMuMDQ3IDE2Ni45OTYgMTMyLjQwMUMxNzIuNDQyIDEyMC43ODEgMTc3LjA5NCAxMTcuODAxIDE4NC4xMTkgMTIxLjQzM0MxOTAuMTI1IDEyNC41MzkgMTkwLjU1NSAxMjkuNDc1IDE4NS43NDIgMTQwLjA0OEMxNzYuNDUxIDE2MC40NTkgMTcyLjc5NiAxNzcuMTYyIDE3Mi43NDkgMTk5LjQyM0MxNzIuNjg1IDIyOS41MzUgMTgwLjU0OCAyNTUuMjIzIDE5Ny4zMzggMjc5Ljc0OUMyMDQuMDg3IDI4OS42MDkgMjIyLjQxMyAzMDcuOTM1IDIzMi4yNzMgMzE0LjY4NEMyNTMuMTI2IDMyOC45NTkgMjc3LjkwMSAzMzcuNTQ1IDMwMy44NDkgMzM5LjQ4OEMzMTIuNDc4IDM0MC4xMzQgMzEzLjEgMzQwLjA1NSAzMTMuMTA5IDMzOC4zMDJDMzEzLjEyNiAzMzQuOTQ1IDMxNy44NTQgMzI2LjE0NCAzMjIuMTM0IDMyMS41QzMyNi4yNzcgMzE3LjAwNiAzMzUuMTgzIDMxMS45MjMgMzM4LjkxNSAzMTEuOTIzQzM0MS40MTUgMzExLjkyMyAzNDIuNjk3IDMxMC4yNzIgMzQzLjU3MyAzMDUuOTIzQzM0NS4xMTkgMjk4LjI1MiAzNTEuMzkgMjg3LjU4NyAzNTguNjIyIDI4MC4zMjhDMzc2Ljk0NSAyNjEuOTQgNDA1LjkxIDI1Ny44MDggNDI3LjczIDI3MC40NzFMNDMxLjg2MSAyNzIuODY4TDQzNi45MzQgMjYyLjY0NkM0NDcuMzExIDI0MS43MzYgNDUxLjUyIDIyMy41OTIgNDUxLjQ4NCAxOTkuOTIzQzQ1MS40MjUgMTYxLjAzNiA0MzguMDU1IDEyOC43NTkgNDEwLjY1OSAxMDEuMzYzQzM4My4wODcgNzMuNzkwOSAzNTAuNzg2IDYwLjQ4OTkgMzExLjU5OSA2MC41NzI5QzI4OS4zMzggNjAuNjE5OSAyNzIuNjM1IDY0LjI3NDkgMjUyLjIyNCA3My41NjU5QzI0MS42NTEgNzguMzc4OSAyMzYuNzE1IDc3Ljk0ODkgMjMzLjYwOSA3MS45NDI5QzIyOS45NzcgNjQuOTE3OSAyMzIuOTU3IDYwLjI2NTkgMjQ0LjU3NyA1NC44MTk5QzI1NS4yMjMgNDkuODMwOSAyNjguMTY0IDQ1LjU2NjkgMjgxLjA5OSA0Mi43ODM5QzI5Ni40MDQgMzkuNDkxOSAzMjcuNzk0IDM5LjQ5MTkgMzQzLjA5OSA0Mi43ODM5QzM1OC4yMDYgNDYuMDMzOSAzNjkuOTE0IDUwLjEyNjkgMzgzLjU5OSA1Ni45NDI5QzQyNy42MjIgNzguODY5OSA0NTguNjEgMTE5LjM5MiA0NjkuMjMxIDE2OC45MjNDNDcyLjIzNyAxODIuOTQzIDQ3Mi41MzYgMjE0LjQ1IDQ2OS43OTYgMjI4LjQyM0M0NjYuODk3IDI0My4yMDYgNDYxLjUxOCAyNTguODc1IDQ1NC43NjUgMjcyLjIxTDQ0OC40MDEgMjg0Ljc3N0w0NTMuNSAyODUuNDcxQzQ1Ni4zMDQgMjg1Ljg1MyA0NjAuNzY1IDI4Ny4wMTYgNDYzLjQxMyAyODguMDU1TDQ2OC4yMjYgMjg5Ljk0NEw0NzQuMDQyIDI3Ny42ODNDNDkxLjgwNiAyNDAuMjMyIDQ5Ni4zMiAyMDAuOTY4IDQ4Ny40NTUgMTYxLjAwMkM0NzIuMzM3IDkyLjg0MTkgNDE5LjI0OSAzOS43NTA5IDM1MS4wMiAyNC41NTY5QzMzMS4zNDggMjAuMTc1OSAzMTIuNTYgMTkuMDQzOSAyOTMuMTUzIDIxLjA3MDlaTTkxLjI3NDggNDAuOTQyOUM3NC45NDY5IDQ0LjM0NTkgNjMuMTMwOCA1Ny4yMTU5IDYxLjAzODggNzMuODc2OUM1OS42MDk4IDg1LjI1MzkgNTcuMTUyOCA4Ny45MjI5IDQ4LjExMDggODcuOTIyOUM0NC42MTY4IDg3LjkyMjkgNDEuMjc5OCA4OC42MTE5IDM5LjA4MjggODkuNzg1OUMyOS4yNjE4IDk1LjAzNzkgMjkuNDU5OCAxMDkuNDYgMzkuNDE0OCAxMTMuOThDNDMuMzE2OCAxMTUuNzUxIDQ2LjUyODggMTE1Ljg4MSA4Ny4xMjk4IDExNS45MDFMMTMwLjY2IDExNS45MjNMMTM0LjQ4MyAxMDguMTczQzEzOS4wMzQgOTguOTQ1OSAxNDguNzU3IDgzLjkxMTkgMTU1LjkzMSA3NS4wMDg5QzE1OC43NzMgNzEuNDgwOSAxNjEuMDk5IDY4LjIyNzkgMTYxLjA5OSA2Ny43Nzg5QzE2MS4wOTkgNjcuMzMwOSAxNTkuMjQ2IDY2LjAxNzkgMTU2Ljk4MSA2NC44NjI5QzE1My4wMTEgNjIuODM2OSAxNDIuNTE4IDYxLjkyNzkgMTQwLjEzMiA2My40MDI5QzEzOC4wNDUgNjQuNjkyOSAxMzIuMzI0IDYwLjk3NDkgMTI4Ljc1OSA1Ni4wMTI5QzEyMC4zODEgNDQuMzUwOSAxMDQuODYyIDM4LjExMTkgOTEuMjc0OCA0MC45NDI5Wk0xOTkuMDIyIDg2Ljg0NTlDMTkzLjQ5OSA5Mi4zNjg5IDE5NS45OSAxMDEuNjAzIDIwMy41MTMgMTAzLjQ5MUMyMDguODIyIDEwNC44MjMgMjE0LjM4OSAxMDEuNjAyIDIxNS42ODIgOTYuNDQ3OUMyMTguMTc3IDg2LjUwNjkgMjA2LjI0MSA3OS42MjY5IDE5OS4wMjIgODYuODQ1OVpNMjU1LjE3NiAxOTNDMjQ3LjMxMSAyMDAuODY1IDI1Ni41NDYgMjEzLjg1MyAyNjYuNDE1IDIwOC44MDZDMjc1Ljg4NiAyMDMuOTYzIDI3Mi43OTEgMTg5LjkyMyAyNjIuMjUzIDE4OS45MjNDMjU5LjEyIDE4OS45MjMgMjU3LjU4NiAxOTAuNTkgMjU1LjE3NiAxOTNaTTMwNSAxOTMuMDI5QzMwMS4yMjQgMTk3LjA3MiAzMDEuMDI1IDIwMi40NzIgMzA0LjUxNCAyMDYuMjM3QzMxMC45OCAyMTMuMjE0IDMyMi4wOTkgMjA5LjA4MSAzMjIuMDk5IDE5OS43QzMyMi4wOTkgMTkwLjY4NiAzMTEuMTcxIDE4Ni40MjIgMzA1IDE5My4wMjlaTTM1NSAxOTMuMDI5QzM0OC4wNjEgMjAwLjQ1NyAzNTQuODMgMjExLjk2NCAzNjQuNjg0IDIwOS40OTFDMzc1LjgyMiAyMDYuNjk1IDM3My42MDYgMTg5LjkyMyAzNjIuMDk5IDE4OS45MjNDMzU4LjY5MyAxODkuOTIzIDM1Ny4zNTUgMTkwLjUwOCAzNTUgMTkzLjAyOVpNMzg3LjE3OCAyODUuNTFDMzczLjEyIDI5MC42MDkgMzYzLjc1NyAzMDIuODIxIDM2Mi4wNjEgMzE4LjI2OUMzNjEuMzgxIDMyNC40NjMgMzYwLjg4NCAzMjUuNzI1IDM1OC4xNzQgMzI4LjE0N0MzNTUuODE4IDMzMC4yNTIgMzU0LjA0NCAzMzAuOTI0IDM1MC44MzMgMzMwLjkyOUMzNDQuMTE2IDMzMC45MzcgMzM5LjUyIDMzMi42OCAzMzYuMTgxIDMzNi40ODJDMzMyLjM3NyAzNDAuODE1IDMzMS45NDIgMzQ3LjMxNiAzMzUuMTE1IDM1Mi40NDlDMzM5LjMwNiAzNTkuMjMgMzM2LjMwOSAzNTguOTkyIDQxMy45NjkgMzU4LjY5M0M0ODMuMTg2IDM1OC40MjYgNDgzLjk4NCAzNTguNCA0ODYuNzc2IDM1Ni4zMzJDNDg4LjMyOSAzNTUuMTgzIDQ5MC4yNDIgMzUyLjQyMiA0OTEuMDI5IDM1MC4xOThDNDkzLjc3MSAzNDIuNDM4IDQ4OS4xMzQgMzM1Ljc3NCA0NzkuNzg5IDMzNC4wNDdDNDczLjkyNCAzMzIuOTY0IDQ3MC4zMjUgMzI5Ljc5MiA0NjkuNTM5IDMyNS4wMTNDNDY4LjE2MSAzMTYuNjQ1IDQ2NC40MTEgMzExLjE0MyA0NTcuNzggMzA3Ljc2QzQ1NC4zNzcgMzA2LjAyNCA0NTIuNDc1IDMwNS43NjYgNDQ2LjE1NSAzMDYuMTgzQzQzNy4zMTIgMzA2Ljc2NyA0MzQuMzI1IDMwNS42NDIgNDMxLjE3NCAzMDAuNTQ0QzQyOC4yMyAyOTUuNzgxIDQyMi4xMzggMjkwLjQ5MiA0MTUuODg1IDI4Ny4yNjlDNDExLjQzNSAyODQuOTc2IDQwOS4wOTcgMjg0LjQ5NSA0MDEuMDk5IDI4NC4yMjZDMzk0LjIxNyAyODMuOTk1IDM5MC4zOCAyODQuMzQ5IDM4Ny4xNzggMjg1LjUxWk0xNDQuNjg4IDMzOS4yM0wxMzEuOTQ1IDM1MS40MjNMMTQ2LjM2NSAzNjUuNzUzTDE2MC43ODQgMzgwLjA4MkwxNzIuODY3IDM2Ny4zMzlMMTg0Ljk1MSAzNTQuNTk1TDE3Ny41NDEgMzQ3LjY3NUMxNzMuNDY2IDM0My44NjkgMTY3LjI3MyAzMzcuNjY5IDE2My43ODEgMzMzLjg5NkwxNTcuNDMgMzI3LjAzN0wxNDQuNjg4IDMzOS4yM1pNNzEuNTk4OCA0MDkuMTI0QzQ2Ljg0ODggNDMyLjg1NiAyNS41ODI4IDQ1My42NzMgMjQuMzQwOCA0NTUuMzg1QzIzLjA5ODggNDU3LjA5NiAyMS41Njg4IDQ2MC45NTUgMjAuOTQxOCA0NjMuOTZDMTcuNTY3OCA0ODAuMTE3IDMxLjkwNDggNDk0LjQ1NCA0OC4wNjE4IDQ5MS4wOEM1MS4wNjY4IDQ5MC40NTMgNTQuOTI2OCA0ODguOTIzIDU2LjYzODggNDg3LjY4MUM2MC4wNTU4IDQ4NS4yMDQgMTQ1LjM3IDM5Ni40NDggMTQ1Ljk3MSAzOTQuNzQ2QzE0Ni4zOTMgMzkzLjU1MSAxMTkuMTczIDM2NS45MDkgMTE3LjYxMiAzNjUuOTQ5QzExNy4wNTUgMzY1Ljk2MyA5Ni4zNDg4IDM4NS4zOTEgNzEuNTk4OCA0MDkuMTI0WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);
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