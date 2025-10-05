import {
    Button,
    Card,
    Group,
    Modal,
    Text,
    TextInput,
    Title,
    Textarea,
    Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { TodoDropzone } from '../Dropzone/Dropzone';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormValues, Todo } from '@/type/Todo';
import dayjs from 'dayjs';
import { useTodo } from '@/hooks/useTodo';

type Props = {
    modalTitle: string;
    inputPlaceholder: string;
    buttonText: string;
    opened: boolean;
    close: () => void;
    propsMethod?: (display_todo_number: number | undefined, values: FormValues, group: string, file: File | null) => void;
    is_preview: boolean;
    todos?: Todo[];
    display_todo_number?: number;
};

export function TodoModal({
    modalTitle,
    inputPlaceholder,
    buttonText,
    opened,
    close,
    propsMethod,
    is_preview,
    todos,
    display_todo_number
}: Props) {
    const { group_id } = useParams();
    const [file, setFile] = useState<File | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const { is_lock, editer_lock_user, edit_lock } = useTodo()



    // display_todo_numberが変更されたときにフォームの値を更新する
    useEffect(() => {
        if (display_todo_number) {
            edit_lock(display_todo_number, opened);
        }
        if (!opened) {
            form.reset();
            setFile(null);
            setExistingImage(null);
        }
        // プレビューモードであり、todoのIDが指定されている場合のみ実行
        if (todos && display_todo_number) {
            // 指定されたIDを持つTodoを探す
            const selectedTodo = todos.find(todo => todo.id === display_todo_number);

            if (selectedTodo) {
                // 見つかったTodoのデータでフォームを更新
                form.reset();
                form.setValues({
                    title: selectedTodo.title,
                    details: selectedTodo.description || '',
                    due_date: selectedTodo.due_date ? selectedTodo.due_date : null,
                    existingImage: selectedTodo.image_url || null
                });

                // 既存Todoのbase64画像をセット
                setExistingImage(selectedTodo.image_url || null);
                setFile(null); // 新規アップロードはなし
            } else {
                setExistingImage(null);
                setFile(null);
            }

        }
    }, [opened, display_todo_number]);

    useEffect(() => {
        form.setFieldValue('existingImage', existingImage);
        console.log(form.values)
    }, [existingImage])

    const today = new Date();

    const form = useForm<FormValues>({
        initialValues: {
            title: '',
            details: '',
            due_date: null,
            file: null,
            group_id: group_id ?? '',
            existingImage: null,
        },
        validate: {
            title: (value) =>
                value.trim().length <= 2 ? 'タスクのタイトルは３文字以上で入力してください' : null,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        if (!group_id) {
            setErrorMsg('不正なグループです');
            return;
        }
        if (propsMethod) { // 存在チェック
            const res = await propsMethod(display_todo_number, {...values}, group_id, file);
            if (res) {
                form.setErrors(res);
                return;
            }
        }
        close();
        form.reset();
        setFile(null);
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            centered
            size="lg"
            title={<Title order={2} mt={10} ml={20}>{modalTitle}</Title>}
        >
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                {is_lock && (
                    <Stack align="left" justify="center" my={5}>
                        <Text c="red" size="lg" fw="bold">
                            {`${editer_lock_user} さんが編集中のため、このタスクは編集できません。`}
                        </Text>
                    </Stack>
                )}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <div>
                            <TextInput
                                readOnly={is_preview || is_lock}
                                label="タスクタイトル"
                                placeholder={inputPlaceholder}
                                {...form.getInputProps('title')}
                            />
                        </div>

                        <div>
                            <Textarea
                                minRows={1}
                                maxRows={3}
                                readOnly={is_preview || is_lock}
                                label="タスク詳細"
                                placeholder="タスクの詳細を入力..."
                                autosize
                                {...form.getInputProps('details')}
                            />
                            {form.errors.details && (
                                <Text c="red" size="sm">{form.errors.details}</Text>
                            )}
                        </div>

                        <div>
                            <DatePickerInput
                                readOnly={is_preview || is_lock}
                                label="期限"
                                placeholder="期限を選択"
                                minDate={today}
                                clearable
                                {...form.getInputProps('due_date')}
                            />
                            {form.errors.due_date && (
                                <Text c="red" size="sm">{form.errors.due_date}</Text>
                            )}
                        </div>

                        <div>
                            <TodoDropzone
                                is_preview={is_preview || is_lock}
                                base64Image={existingImage}
                                file={file}
                                onFileSelect={setFile}
                                onBase64Image={setExistingImage}
                            />

                            {form.errors.file && (
                                <Text c="red" size="sm">{form.errors.file}</Text>
                            )}
                        </div>
                    </Stack>

                    {errorMsg && (
                        <Text c="red" size="sm" mt="sm">{errorMsg}</Text>
                    )}

                    {!(is_preview || is_lock) &&
                        <Group justify="flex-end" mt="lg">
                            <Button type="submit">{buttonText}</Button>
                        </Group>}

                </form>
            </Card>
        </Modal>
    );
}
