import { useEffect, useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import {
  Button,
  Group,
  Text,
  useMantineTheme,
  Image,
  Stack,
} from '@mantine/core';
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from '@mantine/dropzone';
import classes from './TodoDropzone.module.css';

type Props = {
  file: File | null;
  onFileSelect: (file: FileWithPath | null) => void;
  onBase64Image: (existingImage:string | null) => void;
  is_preview: boolean;
  base64Image: string | null
};

export function TodoDropzone({ file, onFileSelect, onBase64Image, is_preview, base64Image }: Props) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const display = file ? URL.createObjectURL(file) : base64Image || null
  const [displaySrc, setDisplaySrc] = useState<string | null>(display)

  const remove_img = () => {
    setDisplaySrc(null);
    onFileSelect(null);
    onBase64Image(null);
  };

  useEffect(() => {
    if (file) {
      setDisplaySrc(URL.createObjectURL(file))
    } else {
      setDisplaySrc(base64Image)
    }
  }, [file]);

  return (
    <div className={classes.wrapper}>
      {displaySrc ? (
        <Stack align="center" mt="xl">
          <Image
            src={displaySrc}
            alt="preview"
            width={'100%'}
            radius="md"
          />
          {!is_preview &&
            <Button
              color="red"
              variant="light"
              radius="xl"
              onClick={() => remove_img()}
            >
              Remove file
            </Button>}

        </Stack>
      ) : (
        <>
          {!is_preview &&
            <Dropzone
              disabled={is_preview}
              openRef={openRef}
              onDrop={(files) => {
                onFileSelect(files[0] || null);
              }}
              className={classes.dropzone}
              radius="md"
              accept={IMAGE_MIME_TYPE}
              maxSize={50 * 1024 ** 2}
              mt={30}
              p={80}
              style={{
                border: '2px dashed lightgray',
                borderRadius: '8px',
              }}
            >
              <div style={{ pointerEvents: 'none' }}>
                <Group justify="center">
                  <Dropzone.Accept>
                    <IconDownload
                      size={50}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={50}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconCloudUpload
                      size={50}
                      stroke={1.5}
                      className={classes.icon}
                    />
                  </Dropzone.Idle>
                </Group>

                <Text ta="center" fw={700} fz="lg" mt="xs">
                  <Dropzone.Accept>Drop image here</Dropzone.Accept>
                  <Dropzone.Reject>Only images under 50MB</Dropzone.Reject>
                  <Dropzone.Idle>Upload image</Dropzone.Idle>
                </Text>
                <Text ta="center" c="dimmed">
                  We accept only <i>.jpg, .png</i> files under 50MB
                </Text>

                <Stack align="center">
                  <Button
                    className={classes.control}
                    size="md"
                    radius="xl"
                    onClick={() => openRef.current?.()}
                  >
                    Select file
                  </Button>
                </Stack>
              </div>
            </Dropzone>
          }
        </>
      )}
    </div>
  );
}
