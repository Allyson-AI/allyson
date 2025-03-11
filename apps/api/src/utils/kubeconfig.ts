import fs from 'fs';
import path from 'path';
import os from 'os';

interface KubeConfigOptions {
  certAuthData: string;
  serverUrl: string;
  token: string;
  clusterName: string;
}

export function generateKubeConfig({
  certAuthData,
  serverUrl,
  token,
  clusterName,
}: KubeConfigOptions): string {
  const tmpDir = os.tmpdir();
  const configPath = path.join(tmpDir, `kubeconfig-${clusterName}-${process.pid}.yaml`);

  const config = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${certAuthData}
    server: ${serverUrl}
  name: ${clusterName}
contexts:
- context:
    cluster: ${clusterName}
    user: ${clusterName}-admin
  name: ${clusterName}
current-context: ${clusterName}
kind: Config
preferences: {}
users:
- name: ${clusterName}-admin
  user:
    token: ${token}`;

  fs.writeFileSync(configPath, config, 'utf8');
  return configPath;
}

export function getKubeConfigPath(): string {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!process.env.K8S_TEST_CERT_AUTH_DATA || !process.env.K8S_TEST_SERVER_URL || !process.env.K8S_TEST_TOKEN ||
      !process.env.K8S_PROD_CERT_AUTH_DATA || !process.env.K8S_PROD_SERVER_URL || !process.env.K8S_PROD_TOKEN) {
    throw new Error('Missing required Kubernetes configuration environment variables');
  }

  const config = isProd ? {
    certAuthData: process.env.K8S_PROD_CERT_AUTH_DATA,
    serverUrl: process.env.K8S_PROD_SERVER_URL,
    token: process.env.K8S_PROD_TOKEN,
    clusterName: 'do-nyc3-browser-k8-production'
  } : {
    certAuthData: process.env.K8S_TEST_CERT_AUTH_DATA,
    serverUrl: process.env.K8S_TEST_SERVER_URL,
    token: process.env.K8S_TEST_TOKEN,
    clusterName: 'do-nyc3-browser-k8-test'
  };

  return generateKubeConfig(config);
}

// Clean up temporary kubeconfig files when the process exits
process.on('exit', () => {
  const tmpDir = os.tmpdir();
  const files = fs.readdirSync(tmpDir);
  files.forEach(file => {
    if (file.startsWith('kubeconfig-') && file.includes(process.pid.toString())) {
      fs.unlinkSync(path.join(tmpDir, file));
    }
  });
}); 