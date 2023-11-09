import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { topKOption } from './types';
import { useEffect } from 'react';

const Container = styled.div`
  margin: 1rem auto;

  label {
    color: #fff !important;
  }
`;

const options: {
  value: topKOption;
  label: string;
}[] = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
];

const TopKSelection = () => {
  const { setValue, register, watch } = useFormContext();

  const currentTopK = watch('topKSelection');
  register('topKSelection');

  // Set the initial value upon component mount
  useEffect(() => {
    if (currentTopK === undefined) {
      setValue('topKSelection', options[0].value);
    }
  }, [setValue, currentTopK]);

  const modifiedOptions = options.map((option) => ({
    value: option.value,
    label:
      currentTopK === option.value
        ? `Top K Returned: ${option.label}`
        : option.label,
  }));

  return (
    <Container>
      <Form.Item name="topKSelection">
        <Select
          value={currentTopK}
          onChange={(selection) => {
            setValue('topKSelection', selection);
          }}
          options={modifiedOptions}
        />
      </Form.Item>
    </Container>
  );
};

export default TopKSelection;
