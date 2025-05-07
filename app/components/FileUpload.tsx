import DropZone from './DropZone';
import { createUpload } from '../actions';

export default function FileUpload() {
    return <DropZone createUpload={createUpload} />;
}
