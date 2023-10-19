import { useParams } from 'react-router-dom';

import { StrictDict } from '@edx/react-unit-test-utils';
import { getConfig } from '@edx/frontend-platform';

import { stepRoutes, stepNames } from './constants';

const useBaseUrl = () => {
  const { xblockId, courseId } = useParams();
  return `${getConfig().LMS_BASE_URL}/courses/${courseId}/xblock/${xblockId}/handler`;
};

export const useORAConfigUrl = () => {
  const baseUrl = useBaseUrl();
  return `${baseUrl}/get_block_info`;
};

export const useViewUrl = () => {
  const { xblockId, courseId } = useParams();
  return ({ view }) => `${getConfig().BASE_URL}/${stepRoutes[view]}/${courseId}/${xblockId}`;
};

export const usePageDataUrl = (step) => {
  const baseUrl = useBaseUrl();
  if ([stepNames.submission, stepNames.xblock].includes(step)) {
    return `${baseUrl}/get_block_learner_submission_data`;
  }
  return `${baseUrl}/get_block_learner_assessment_data/${step}`;
};

export default StrictDict({
  useORAConfigUrl,
  usePageDataUrl,
});
