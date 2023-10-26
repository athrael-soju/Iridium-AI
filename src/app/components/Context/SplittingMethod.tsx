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
  const { setValue } = useFormContext();

  return (
    <Container>
      <Form.Item name="splittingMethod" label="Splitting Method">
        <Select
          defaultValue="markdown"
          onChange={(v) => {
            console.log(v);
            setValue('splittingMethod', v);
          }}
          options={options}
        />
      </Form.Item>
    </Container>
  );
};

export default SplittingMethod;
