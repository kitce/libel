import React from 'react';

/**
 * dummy LIHKG SubmissionForm component
 * @abstract
 */
abstract class SubmissionForm extends React.Component {
  abstract replaceEditorContent (body: string): void;
}

SubmissionForm.displayName = 'SubmissionForm';

export default SubmissionForm;
