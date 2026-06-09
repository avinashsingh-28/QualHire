import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Play, CheckCircle, XCircle, 
  Settings, Maximize, AlertCircle
} from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const PROBLEM_DATA = {
  title: 'Two Sum',
  difficulty: 'Easy',
  timeLimit: '30:00',
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
  }
};

const CodingAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(PROBLEM_DATA.starterCode.javascript);
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' or 'result'
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds

  useEffect(() => {
    setCode(PROBLEM_DATA.starterCode[language]);
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('result');
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: 'Accepted',
        runtime: '65 ms',
        memory: '42.1 MB',
        passed: 2,
        total: 2
      });
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    navigate('/candidate/assessments');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Navbar */}
      <div style={{ 
        height: '56px', backgroundColor: '#2d2d2d', borderBottom: '1px solid #404040',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/candidate/assessments')} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#fff' }}>{PROBLEM_DATA.title}</div>
          <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#10b98120', color: '#10b981', fontWeight: 600 }}>{PROBLEM_DATA.difficulty}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 300 ? '#ef4444' : '#a3a3a3', fontWeight: 600, fontSize: '15px' }}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={handleRunCode} disabled={isRunning} style={{ backgroundColor: '#404040', color: '#fff', border: 'none' }} leftIcon={<Play size={14} />}>
              Run Code
            </Button>
            <Button variant="primary" onClick={handleSubmit} style={{ backgroundColor: '#10b981' }}>
              Submit Code
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Pane: Problem Description */}
        <div style={{ width: '40%', borderRight: '1px solid #404040', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #404040', backgroundColor: '#252526', display: 'flex', gap: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', borderBottom: '2px solid #3b82f6', paddingBottom: '4px' }}>Description</span>
            <span style={{ fontSize: '13px', color: '#a3a3a3' }}>Submissions</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>1. {PROBLEM_DATA.title}</h2>
            
            <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#cccccc', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
              {PROBLEM_DATA.description}
            </div>

            <div style={{ marginBottom: '32px' }}>
              {PROBLEM_DATA.examples.map((ex, idx) => (
                <div key={idx} style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Example {idx + 1}:</p>
                  <div style={{ backgroundColor: '#2d2d2d', padding: '16px', borderRadius: '8px', border: '1px solid #404040', fontFamily: 'monospace', fontSize: '13px' }}>
                    <div><strong style={{ color: '#9cdcfe' }}>Input:</strong> {ex.input}</div>
                    <div><strong style={{ color: '#9cdcfe' }}>Output:</strong> {ex.output}</div>
                    {ex.explanation && <div style={{ marginTop: '8px', color: '#a3a3a3' }}><strong style={{ color: '#9cdcfe' }}>Explanation:</strong> {ex.explanation}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Constraints:</p>
              <ul style={{ paddingLeft: '20px', color: '#cccccc', fontSize: '14px', lineHeight: '1.8' }}>
                {PROBLEM_DATA.constraints.map((c, idx) => (
                  <li key={idx}><code style={{ backgroundColor: '#2d2d2d', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>{c}</code></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor & Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Code Editor Header */}
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #404040', backgroundColor: '#252526', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #555', padding: '4px 8px', borderRadius: '4px', outline: 'none', fontSize: '13px' }}
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="java">Java 17</option>
            </select>

            <div style={{ display: 'flex', gap: '12px', color: '#a3a3a3' }}>
              <Settings size={16} style={{ cursor: 'pointer' }} />
              <Maximize size={16} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Editor Area (Mock textarea) */}
          <div style={{ flex: 2, display: 'flex' }}>
            {/* Line numbers mock */}
            <div style={{ width: '40px', backgroundColor: '#1e1e1e', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px', color: '#858585', fontSize: '14px', fontFamily: 'monospace' }}>
              {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{ 
                flex: 1, backgroundColor: '#1e1e1e', color: '#d4d4d4', border: 'none', outline: 'none', 
                padding: '16px', fontFamily: 'Consolas, Monaco, monospace', fontSize: '15px', lineHeight: '1.5',
                resize: 'none', whiteSpace: 'pre'
              }}
            />
          </div>

          {/* Console / Test Cases Area */}
          <div style={{ flex: 1, borderTop: '1px solid #404040', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
            <div style={{ padding: '8px 20px', backgroundColor: '#252526', display: 'flex', gap: '20px' }}>
              <button 
                onClick={() => setActiveTab('testcases')}
                style={{ background: 'none', border: 'none', color: activeTab === 'testcases' ? '#fff' : '#a3a3a3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', paddingBottom: '4px', borderBottom: activeTab === 'testcases' ? '2px solid #3b82f6' : '2px solid transparent' }}
              >
                Test Cases
              </button>
              <button 
                onClick={() => setActiveTab('result')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: activeTab === 'result' ? '#fff' : '#a3a3a3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', paddingBottom: '4px', borderBottom: activeTab === 'result' ? '2px solid #3b82f6' : '2px solid transparent' }}
              >
                {runResult && <CheckCircle size={14} color="#10b981" />} Test Result
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {activeTab === 'testcases' && (
                <div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '6px 12px', backgroundColor: '#3b82f620', color: '#3b82f6', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}>Case 1</div>
                    <div style={{ padding: '6px 12px', backgroundColor: '#2d2d2d', color: '#a3a3a3', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Case 2</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#a3a3a3', marginBottom: '4px' }}>nums =</p>
                    <div style={{ padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>[2,7,11,15]</div>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#a3a3a3', marginBottom: '4px' }}>target =</p>
                    <div style={{ padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>9</div>
                  </div>
                </div>
              )}

              {activeTab === 'result' && (
                <div>
                  {isRunning ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a3a3a3' }}>
                      <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #404040', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Running code...
                    </div>
                  ) : runResult ? (
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '16px' }}>{runResult.status}</h3>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#a3a3a3', marginBottom: '24px' }}>
                        <span>Runtime: <strong style={{ color: '#fff' }}>{runResult.runtime}</strong></span>
                        <span>Memory: <strong style={{ color: '#fff' }}>{runResult.memory}</strong></span>
                        <span>Passed: <strong style={{ color: '#fff' }}>{runResult.passed}/{runResult.total}</strong> Test Cases</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#a3a3a3', fontSize: '14px' }}>You must run your code first.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Submit Confirmation Modal */}
      <Modal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assessment"
        size="sm"
      >
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ textAlign: 'center', marginBottom: '8px' }}>Are you sure you want to submit?</p>
          <p style={{ textAlign: 'center', fontSize: '13px' }}>You have <strong>{formatTime(timeLeft)}</strong> remaining. Once submitted, you cannot change your code.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
          <Button variant="primary" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }} onClick={handleConfirmSubmit}>Confirm Submit</Button>
        </div>
      </Modal>

    </div>
  );
};

export default CodingAssessment;
