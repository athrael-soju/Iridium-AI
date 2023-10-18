import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FileUploaderProps {
  splittingMethod: string;
  chunkSize: number;
  overlap: number;
  setCards: React.Dispatch<React.SetStateAction<any[]>>;
  namespace: string;
}

const FileUpload: React.FC<FileUploaderProps> = ({
  splittingMethod,
  chunkSize,
  overlap,
  setCards,
  namespace,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const options = {
    splittingMethod,
    chunkSize,
    overlap,
    namespace,
  };

  return (
    <div>
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        maxParallelUploads={1}
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
            let formData = new FormData();
            formData.set('file', file);
            console.log('File Upload Initiated...');

            const config = {
              onUploadProgress: function (e) {
                progress(e.lengthComputable, e.loaded, e.total);
                setIngesting(true);
              },
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };

            axios
              .post('/api/upload', formData, config)
              .then(async function (response) {
                load(response.data);
                console.log('File Upload Successful...');
                let filename = file.name;
                console.log('File Ingest Initiated...');
                const ingestResponse = await axios.post('/api/ingest', {
                  filename,
                  options: options,
                });

                if (
                  ingestResponse.status >= 200 &&
                  ingestResponse.status < 300
                ) {
                  console.log('File Ingest Successful');
                  const { documents } = await ingestResponse.data;
                  setCards(documents);
                  setIngesting(false);
                } else {
                  console.log('File Ingest Failed');
                  throw new Error('File Ingest Failed');
                }
              })
              .catch(function () {
                error('File Upload Failed');
                throw new Error('File Upload Failed');
              });

            return {
              abort: () => {
                // axios does not provide an abort method, so we leave this empty
              },
            };
          },
        }}
        name="file"
        labelIdle={`<div class="filepond--label-idle"><i class="fas fa-cloud-upload-alt" style="font-size: 60px; color: white; margin-right: 20px;"></i><div >${
          ingesting
            ? '<span>Ingesting<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></span>'
            : 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        }</div></div>`}
      />
    </div>
  );
};

export default FileUpload;
