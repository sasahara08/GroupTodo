import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './Modal.module.css';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';

type props = {
  modalTitle: string;
  inputPlaceholder: string;
  buttonText: string;
  opened: boolean;
  close: () => void;
  propsMethod: (value: string) => void;
}

export function InputFormModal({ modalTitle, inputPlaceholder, buttonText, opened, close, propsMethod }: props) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      value: '',
    },
    validate: {
      value: (value) => {
        if (!value) return 'フォームの入力は必須です';
      }
    },
  });

  const handleSubmit = async (value: string) => {
    propsMethod(value)
    form.reset()
    close()
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size={isMobile ? '95%' : 800}
      title={<Title order={2} mt={10} ml={20}>{modalTitle}</Title>}
      portalProps={isMobile ? undefined : { target: '#main-content' }}
    >
      <Container size={isMobile ? '100%' : 800} my={10}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values.value))}>
          <TextInput label="" placeholder={inputPlaceholder} {...form.getInputProps('value')} />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Button type="submit" className={classes.control}>{buttonText}</Button>
          </Group>
        </form>
      </Container>
    </Modal>
  );
}
