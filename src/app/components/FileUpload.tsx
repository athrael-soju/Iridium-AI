import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
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
}

const FileUpload: React.FC<FileUploaderProps> = ({
  splittingMethod,
  chunkSize,
  overlap,
  setCards,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const options = {
    splittingMethod,
    chunkSize,
    overlap,
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
            // TODO: Use fetch instead of XMLHttpRequest
            let formData = new FormData();
            formData.set('file', file);
            console.log('File Upload Initiated...');
            const request = new XMLHttpRequest();
            request.open('POST', '/api/upload');

            // Use `request.upload.onprogress` to handle progress updates
            request.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total);
              setIngesting(true);
            };

            // Use `request.onload` to handle the response from the server
            request.onload = async function () {
              if (request.status >= 200 && request.status < 300) {
                load(request.responseText);
                console.log('File Upload Successful...');
                // After successful upload, call another API.
                let filename = file.name;
                console.log('File Ingest Initiated...');
                const response = await fetch('/api/ingest', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    filename,
                    options: options,
                  }),
                });

                if (response.status >= 200 && response.status < 300) {
                  console.log('File Ingest Successful');
                  const { documents } = await response.json();
                  setCards(documents);
                  setIngesting(false);
                } else {
                  console.log('File Ingest Failed');
                  throw new Error('File Ingest Failed');
                }
              } else {
                error('File Upload Failed');
                throw new Error('File Upload Failed');
              }
            };

            request.send(formData);
            // Return an abort method to stop the request
            return {
              abort: () => {
                request.abort();
                abort();
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
