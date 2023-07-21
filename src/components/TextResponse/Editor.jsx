import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce.min';
import 'tinymce/icons/default';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/directionality';
import 'tinymce/themes/silver/theme';
import '@edx/tinymce-language-selector';
import 'tinymce/skins/ui/oxide/skin.css';
import contentCss from 'tinymce/skins/content/default/content.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';

import { Alert } from '@edx/paragon';
import { StrictDict, useKeyedState } from '@edx/react-unit-test-utils';

export const stateKeys = StrictDict({
  charCount: 'charCount',
});

const RichEditor = ({
  id,
  input,
  value,
  setValue,
  disabled,
}) => {
  const [charCount, setCharCount] = useKeyedState(stateKeys.charCount, 0);

  const initCharCount = (event, editor) => {
    const content = editor.getContent({ format: 'text' });
    setCharCount(content.length);
  };

  const updateCharCount = (event, editor) => {
    const content = editor.getContent({ format: 'text' });
    setCharCount(content.length);
    const htmlContent = editor.getContent();
    setValue(htmlContent);
  };

  /*
  const {
    maxChars,
    id,
    label,
    input: {
      value,
      name,
    },
    meta: {
      submitFailed,
      error,
    },
    disabled,
  } = this.props;
  */

  const maxChars = 1000;
  const remainingChars = maxChars - charCount;
  const characterLimitMessage = `Recommended character limit (including spaces) is
    ${maxChars}. ${remainingChars} characters remaining.`;

  let contentStyle;
  // In the test environment this causes an error so set styles to empty since they aren't needed for testing.
  try {
    contentStyle = [contentCss, contentUiCss].join('\n');
  } catch (err) {
    contentStyle = '';
  }

  return (
    <div className="form-group">
      <Editor
        initialValue={value}
        init={{
          branding: false,
          menubar: false,
          plugins: 'legacyoutput link lists language directionality',
          statusbar: false,
          selector: `#${id}`,
          toolbar: 'undo redo | bold italic underline | bullist numlist | link | language | ltr rtl',
          entity_encoding: 'raw',
          extended_valid_elements: 'span[lang|id] -span',
          content_css: false,
          content_style: contentStyle,
          default_link_target: '_blank',
        }}
        onChange={updateCharCount}
        onKeyUp={updateCharCount}
        onInit={initCharCount}
        disabled={disabled}
      />
      {maxChars && <span>{characterLimitMessage}</span>}
    </div>
  );
};

RichEditor.defaultProps = {
  maxChars: null,
  disabled: false,
};

RichEditor.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  maxChars: PropTypes.number,
  input: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default RichEditor;
