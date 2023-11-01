import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { maxPagesOption } from './types';
import { useEffect } from 'react';

const Container = styled.div`
  margin: 1rem auto;

  label {
    color: #fff !important;
  }
`;

const options: {
  value: maxPagesOption;
  label: string;
}[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 4, label: '4' },
  { value: 8, label: '8' },
];

const MaxPagesSelection = () => {
  const { setValue, register, watch } = useFormContext();

  const currentMaxPages = watch('maxPagesSelection');
  register('maxPagesSelection');

  // Set the initial value upon component mount
  useEffect(() => {
    if (currentMaxPages === undefined) {
      setValue('maxPagesSelection', options[0].value);
    }
  }, [setValue, currentMaxPages]);

  const modifiedOptions = options.map((option) => ({
    value: option.value,
    label:
      currentMaxPages === option.value
        ? `Max Crawl Pages: ${option.label}`
        : option.label,
  }));

  return (
    <Container>
      <Form.Item name="maxPagesSelection">
        <Select
          value={currentMaxPages}
          onChange={(selection) => {
            setValue('maxPagesSelection', selection);
          }}
          options={modifiedOptions}
        />
      </Form.Item>
    </Container>
  );
};

export default MaxPagesSelection;
