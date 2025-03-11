export function getFileTypeFromBase64(base64String) {
  const signatures = {
    '/9j/': 'image/jpeg',
    'iVBORw0KGgo': 'image/png',
    'R0lGODlh': 'image/gif',
    'UklGRg': 'image/webp',
    'JVBERi0': 'application/pdf',
    'UEsDBBQABgAIAA': 'application/vnd.openxmlformats-officedocument',
    'PK': 'application/zip',
    '0M8R4KGxGuE': 'application/msword',
    'MIME-Version:': 'message/rfc822',
    '<?xml version=': 'application/xml',
    '<!DOCTYPE html': 'text/html',
    'GIF87a': 'image/gif',
    'GIF89a': 'image/gif',
    'RIFF': 'audio/wav',
    'OggS': 'audio/ogg',
    'ID3': 'audio/mpeg',
    'fLaC': 'audio/flac',
    '%PDF-': 'application/pdf',
    'BM': 'image/bmp',
    '7z¼¯': 'application/x-7z-compressed',
    'Rar!': 'application/x-rar-compressed',
    '{\rtf1': 'application/rtf',
    '-----BEGIN PGP': 'application/pgp-encrypted',
  };

  // Check if the base64String starts with any of the signatures
  for (const [signature, mimeType] of Object.entries(signatures)) {
    if (base64String.startsWith(signature)) {
      return mimeType;
    }
  }

  // Additional checks for specific file types
  if (base64String.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (base64String.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (base64String.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }

  // If no match found, try to decode a small portion of the string
  try {
    const decodedStart = atob(base64String.slice(0, 8));
    if (decodedStart.startsWith('%PDF-')) {
      return 'application/pdf';
    }
    // Add more checks here if needed
  } catch (error) {
    console.warn('Unable to decode base64 string:', error);
  }

  return 'application/octet-stream'; // Default to binary if type can't be determined
}
