import { execSync } from 'child_process';

export default async () => {
  console.log('Resetting test database...');
  execSync(
    'docker exec dev_postgres psql -U postgres -c "DROP DATABASE IF EXISTS iam_system_test;"',
  );
  execSync(
    'docker exec dev_postgres psql -U postgres -c "CREATE DATABASE iam_system_test;"',
  );
  console.log('Test database reset complete.');
};
