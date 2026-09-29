import { aboutPage, homepage, legal, workPage } from '@/content/pages'
import { getFeaturedProjects, getProjectBySlug, type Project, projects } from '@/content/projects'
import { projectSchema } from '@/content/schemas'
import { footerNav, navItems, site } from '@/content/site'

export type ContentRepository = {
  getSite: () => typeof site
  getNav: () => typeof navItems
  getFooterNav: () => typeof footerNav
  getHomepage: () => typeof homepage
  getAbout: () => typeof aboutPage
  getWorkPage: () => typeof workPage
  getLegal: () => typeof legal
  listProjects: () => Project[]
  listFeaturedProjects: () => Project[]
  getProject: (slug: string) => Project | undefined
}

function assertProjects(list: Project[]): Project[] {
  return list.map((project) => projectSchema.parse(project))
}

export const staticContentAdapter: ContentRepository = {
  getSite: () => site,
  getNav: () => navItems,
  getFooterNav: () => footerNav,
  getHomepage: () => homepage,
  getAbout: () => aboutPage,
  getWorkPage: () => workPage,
  getLegal: () => legal,
  listProjects: () => assertProjects(projects),
  listFeaturedProjects: () => assertProjects(getFeaturedProjects()),
  getProject: (slug) => {
    const project = getProjectBySlug(slug)
    return project ? projectSchema.parse(project) : undefined
  },
}

/** Default content repository — static TypeScript adapter. */
export const content: ContentRepository = staticContentAdapter
