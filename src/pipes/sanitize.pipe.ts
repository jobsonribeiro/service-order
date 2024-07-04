import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const dompurify = DOMPurify(window);

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return dompurify.sanitize(value);
    }
    return value;
  }
}
