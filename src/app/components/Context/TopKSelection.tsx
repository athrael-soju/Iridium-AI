import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { topKOption } from './types';

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

  // Initialize the value if needed
  const currentTopK = watch('topKSelection');

  // Register the field so react-hook-form knows about it
  register('topKSelection');

  return (
    <Container>
      <Form.Item name="topKSelection" label="Top K Elements">
        <Select
          value={currentTopK}
          onChange={(selection) => {
            setValue('topKSelection', selection);
          }}
          options={options}
        />
      </Form.Item>
    </Container>
  );
};

export default TopKSelection;
