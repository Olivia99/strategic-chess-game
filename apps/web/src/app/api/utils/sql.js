import { neon } from '@neondatabase/serverless';

const NullishQueryFunction = () => {
  console.error('DATABASE_URL not configured');
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
};
NullishQueryFunction.transaction = () => {
  console.error('DATABASE_URL not configured for transaction');
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
};

let sql;
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
    console.log('Database connection initialized successfully');
  } else {
    console.warn('DATABASE_URL not found, using fallback function');
    sql = NullishQueryFunction;
  }
} catch (error) {
  console.error('Error initializing database connection:', error);
  sql = NullishQueryFunction;
}

export default sql;