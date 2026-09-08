import { withInstall } from '../../shared/with-install'
import Add from './src/generated/SIconAdd.vue'
import Delete from './src/generated/SIconDelete.vue'
import Edit from './src/generated/SIconEdit.vue'
import Search from './src/generated/SIconSearch.vue'
import ArrowRight from './src/generated/SIconArrowRight.vue'
import Loading from './src/generated/SIconLoading.vue'
export const SIconAdd = /* @__PURE__ */ withInstall(Add, 'SIconAdd')
export const SIconDelete = /* @__PURE__ */ withInstall(Delete, 'SIconDelete')
export const SIconEdit = /* @__PURE__ */ withInstall(Edit, 'SIconEdit')
export const SIconSearch = /* @__PURE__ */ withInstall(Search, 'SIconSearch')
export const SIconArrowRight = /* @__PURE__ */ withInstall(ArrowRight, 'SIconArrowRight')
export const SIconLoading = /* @__PURE__ */ withInstall(Loading, 'SIconLoading')
export type { IconProps } from './src/public-types'
