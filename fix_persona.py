#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

with open('app\\[locale]\\page.en.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the old persona card structure with new one
old_persona_button = r'''                  <button
                    key={persona.name}
                    className={`persona-card\$\{activePersona === idx \? " active" : ""\}`}
                    onClick=\{\(\) => \{
                      setActivePersona\(idx\);
                      setActiveQuestion\(0\);
                    \}\}
                  >
                    <div
                      className="persona-avatar"
                      style=\{\{ backgroundImage: `url\(\$\{persona.image\}\)` \}\}
                      aria-hidden="true"
                    >
                      <span>\{persona.name\[0\]\}</span>
                    </div>
                    <div className="persona-meta">
                      <strong>
                        \{persona.name\}, \{persona.age\}
                      </strong>
                      <div className="persona-income">\{persona.income\}</div>
                      <div className="persona-pain">\{persona.pain\}</div>
                      <span className="persona-badge">\{persona.data\}</span>
                    </div>
                  </button>'''

new_persona_button = '''                  <button
                    key={persona.name}
                    className={`persona-card${activePersona === idx ? " active" : ""}`}
                    onClick={() => {
                      setActivePersona(idx);
                    }}
                  >
                    <div
                      className="persona-avatar"
                      style={{ backgroundImage: `url(${persona.image})` }}
                      aria-hidden="true"
                    ></div>
                    <div className="persona-meta">
                      <strong>
                        {persona.name}, {persona.age}
                      </strong>
                      <div className="persona-role">{persona.role}</div>
                      <div className="persona-income">{persona.income}</div>
                      <div className="persona-tags">
                        {persona.preferences.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="persona-badge">{persona.data}</span>
                    </div>
                  </button>'''

content = re.sub(old_persona_button, new_persona_button, content, flags=re.MULTILINE)

with open('app\\[locale]\\page.en.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed persona button structure')
