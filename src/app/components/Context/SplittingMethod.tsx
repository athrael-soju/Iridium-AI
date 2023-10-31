import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { SplittingMethodOption } from './types';
import { useEffect } from 'react';

const Container = styled.div`
  margin: 1rem auto;

  label {
    color: #fff !important;
  }
`;

const options: {
  value: SplittingMethodOption;
  label: string;
}[] = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'recursive', label: 'Recursive' },
];

const SplittingMethod = () => {
  const { setValue, register, watch } = useFormContext();

  const currentMethod = watch('splittingMethod');
  register('splittingMethod');

  // Set the initial value upon component mount
  useEffect(() => {
    if (currentMethod === undefined) {
      setValue('splittingMethod', options[0].value);
    }
  }, [setValue, currentMethod]);

  const modifiedOptions = options.map((option) => ({
    value: option.value,
    label:
      currentMethod === option.value
        ? `Splitting Method: ${option.label}`
        : option.label,
  }));

  return (
    <Container>
      <Form.Item name="splittingMethod">
        <Select
          value={currentMethod}
          onChange={(selection) => {
            setValue('splittingMethod', selection);
          }}
          options={modifiedOptions}
        />
      </Form.Item>
    </Container>
  );
};

export default SplittingMethod;
