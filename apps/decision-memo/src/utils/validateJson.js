const MIN_LENGTH = 10;
const VALID_RISKS = ['Low', 'Medium', 'High'];

export function validateExtractStructure(data) {
  for (const field of ['title', 'context']) {
    if (typeof data[field] !== 'string' || data[field].length < MIN_LENGTH) {
      throw new Error(`Field "${field}" is missing or too short`);
    }
  }
  if (!Array.isArray(data.options) || data.options.length < 2) {
    throw new Error('options must have at least 2 items');
  }
  for (const opt of data.options) {
    if (typeof opt.name !== 'string' || opt.name.trim() === '') {
      throw new Error('Each option must have a non-empty name');
    }
  }
}

export function validateGenerateMemo(data) {
  for (const field of ['context', 'recommendation']) {
    if (typeof data[field] !== 'string' || data[field].length < MIN_LENGTH) {
      throw new Error(`Field "${field}" is missing or too short`);
    }
  }
  if (!Array.isArray(data.options) || data.options.length < 2) {
    throw new Error('options must have at least 2 items');
  }
  for (const opt of data.options) {
    if (!VALID_RISKS.includes(opt.risk)) {
      opt.risk = 'Medium';
    }
    if (typeof opt.description !== 'string' || opt.description.length < MIN_LENGTH) {
      throw new Error(`Option "${opt.name}" description is missing or too short`);
    }
    if (!Array.isArray(opt.pros) || opt.pros.length < 2) {
      throw new Error(`Option "${opt.name}" must have at least 2 pros`);
    }
    if (!Array.isArray(opt.cons) || opt.cons.length < 2) {
      throw new Error(`Option "${opt.name}" must have at least 2 cons`);
    }
  }
}
