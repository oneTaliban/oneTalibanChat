import React, {useState} from 'react';
import {gsap} from 'gsap';

const EthicalHacking = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const hackingDemos = [
    {
      id: 1,
      title: "SQL injection Demo",
      description: "See how sql injection works and how to prevent them",
      vulnerability: "Unsanitized user input in database queries",
      attack: "'; DROP TABLE users; --",
      prevention: "Use parameterized queries and input validation",
      code: `
        // VULNERABLE CODE 
        query = "SELECT * FROM users WHERE  username = '" + username + "'";

        // SECURE CODE
        query = "SELECT * FROM  users WHERE username = ?";
        db.execute(query, [username]);
      `,

    },
    {
      id: 2,
      title: "XSS Attack demo",
      description: "Understand Cross-Site scripting vulnerability",
      vulnerability: "Rendering unsanitized user input as html",
      attack: "<script>alert('XSS')</script>",
      prevention: "Use like React's built-in XSS protection and sanitize inputs",
      code: `
        // VULNERABLE CODE
        <div dangerouslySetInnerHtml={{__html: usercontent}} />

        //SECURE CODE
        <div> {userContent} </div> //react automatically escapes
      `,
      
    },
    {
      id: 3,
      title: "CSRF Protection",
      description: "Cross Site Request Forgery demonstration",
      vulnerability: "No CSRF token validation",
      attack: "",
      prevention: "Use Django's CSRF middleware and same-site cookies",
      code: `
        //Django automatically handle CSRF tokens
        //Include {% csrf_token %}
        //Use axios with CSRF token header
      `,
      
    },
    {
      id: 4,
      title: "",
      description: "",
      vulnerability: "",
      attack: "",
      prevention: "",
      code: ``,
      
    },
    
  ]
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Ethical Hacking Demonstration
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackingDemos.map((demo) => (
            <div
              key={demo.id}
              className='bg-gray-800 rounded-xl border border-purple-500/30 p-6 hover:border-purple-400 transition-all duration-300 cursor-pointer'
              onClick={() => setActiveDemo(demo)}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-3">
                {demo.title}
              </h3>
              <p className="text-gray-300 mb-4">{demo.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-red-400 font-semibold">Vulnerability:</span>
                  <p className="text-sm text-gray-400">{demo.vulnerability}</p>
                </div>

                {demo.attack && (
                  <div>
                    <span className="text-yellow-400 font-semibold">Attack:</span>
                    <code className="block text-xs bg-gray-900 p-2 rounded mt-1 font-mono">
                      {demo.attack}
                    </code>
                  </div>
                )}

                <div>
                  <span className="text-green-400 font-semibold">Prevention:</span>
                  <p className="text-sm text-gray-400">{demo.prevention}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {activeDemo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2l font-bold text-purple-400">
                  {activeDemo.title}
                </h2>
                <button onClick={() => setActiveDemo(null)} className="text-gray-400 hover:text-white transition-colors">
                  X
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Vulnerabilty
                  </h3>
                  <p className="text-gray-300">{activeDemo.vulnerability}</p>
                </div>
                
                {activeDemo.attack && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                      Attack Vector
                    </h3>
                    <code className="block bg-gray-900 p-4 rounded-lg text-sm font-mono">
                      {activeDemo.attack}
                    </code>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Prevention
                  </h3>
                  <p className="text-gray-300 mb-4">{activeDemo.prevention}</p>
                  <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    <code className="language-javascript">
                      {activeDemo.code}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

export default EthicalHacking