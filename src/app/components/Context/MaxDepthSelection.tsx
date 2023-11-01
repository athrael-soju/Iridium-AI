import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { maxDepthOption } from './types';
import { useEffect } from 'react';

const Container = styled.div`
  margin: 1rem auto;

  label {
    color: #fff !important;
  }
`;

const options: {
  value: maxDepthOption;
  label: string;
}[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
];

const MaxDepthSelection = () => {
  const { setValue, register, watch } = useFormContext();

  const currentMaxDepth = watch('maxDepthSelection');
  register('maxDepthSelection');

  useEffect(() => {
    if (currentMaxDepth === undefined) {
      setValue('maxDepthSelection', options[0].value);
    }
  }, [setValue, currentMaxDepth]);

  const modifiedOptions = options.map((option) => ({
    value: option.value,
    label:
      currentMaxDepth === option.value
        ? `Max Crawl Depth: ${option.label}`
        : option.label,
  }));

  return (
    <Container>
      <Form.Item name="maxDepthSelection">
        <Select
          value={currentMaxDepth}
          onChange={(selection) => {
            setValue('maxDepthSelection', selection);
          }}
          options={modifiedOptions}
        />
      </Form.Item>
    </Container>
  );
};

export default MaxDepthSelection;
