import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  name,
  label = null,
  onSave,
  placeholder = 'Write Your name',
  wrapperClassName = '',
  emptyMsg = 'Input is missing',
  ...inputProps
}) => {
  const [input, setInput] = useState(initialValue);

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);
  // console.log(input);

  const [isEditable, setIsEditable] = useState(false);

  const onEditClick = useCallback(() => {
    setIsEditable(p => !p);
    setInput(initialValue);
  }, [initialValue]);

  const onSaveClick = async () => {
    const trimmed = input.trim();
    if (trimmed === '') Alert.info(emptyMsg, 4000);

    if (trimmed !== initialValue) await onSave(trimmed);
    setIsEditable(false);
  };
  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEditable}
          value={input}
          placeholder={placeholder}
          onChange={onInputChange}
          emptyMsg={emptyMsg}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
