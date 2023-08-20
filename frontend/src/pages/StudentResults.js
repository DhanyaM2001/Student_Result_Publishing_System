import React, { useState } from 'react';
import { Box} from '@mui/material';
import ResultForm from './ResultForm';
import ResultDisplay from './ResultDisplay';

const StudentResults = () => {
  const [result, setResult] = useState(null); // State variable to hold the result

  const resetForm = () => {
    setResult(null);
  };

  return (
    <Box>
          {result && result.condition && result.subjectNames ? (
            <ResultDisplay result={result} resetForm={resetForm} />
          ) : (
            <ResultForm setResult={setResult} />
          )}
       
      
    </Box>
  );
};

export default StudentResults;
