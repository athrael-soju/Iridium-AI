import { Form, Select } from 'antd';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { SplittingMethodOption } from './types';

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
  { value: 'markdown', label: 'Markdown Splitting' },
  { value: 'recursive', label: 'Recursive Text Splitting' },
];

const SplittingMethod = () => {
  const { setValue, register, watch } = useFormContext();

  // Initialize the value if needed
  const currentMethod = watch('splittingMethod');

  // Register the field so react-hook-form knows about it
  register('splittingMethod');

  return (
    <Container>
      <Form.Item name="splittingMethod" label="Splitting Method">
        <Select
          value={currentMethod}
          onChange={(selection) => {
            setValue('splittingMethod', selection);
          }}
          options={options}
        />
      </Form.Item>
    </Container>
  );
};

export default SplittingMethod;
