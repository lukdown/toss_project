import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';

function Correction({ analysisData }) {
  const dmp = new diff_match_patch();
  
  const originalText = analysisData?.grammar.original_text.text || '입력된 문장이 없습니다.';
  const correctedText = analysisData?.grammar.corrected_text || '입력된 문장이 없습니다.';
  
  const [diffHtml, setDiffHtml] = useState('');

  useEffect(() => {
    const diff = dmp.diff_main(originalText, correctedText);
    // dmp.diff_cleanupSemantic(diff); // Comment out or remove this line

    const diffHTML = diff.map(part => {
      if (part[0] === 0) {
        return `<span>${part[1]}</span>`; // Unchanged text remains black
      } else if (part[0] === 1) {
        return `<span style="color:red;">${part[1]}</span>`; // Added text in red
      } else if (part[0] === -1) {
        return ''; // Removed text is not displayed
      }
    }).join('');
    setDiffHtml(diffHTML);
  }, [originalText, correctedText, dmp]);

  return (
    <div className="correction">
      <h3>Grammar</h3>
      <p>당신의 문장: <span dangerouslySetInnerHTML={{ __html: diffHtml }} /></p>
    </div>
  );
}

export default Correction;
