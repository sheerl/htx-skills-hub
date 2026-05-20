// HTX Skill Hub — frontend logic

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ========== Home page ==========
  function renderHome() {
    const wrap = $('#filter-bar');
    if (!wrap) return;

    window.HTX_CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-tab' + (cat.id === 'all' ? ' active' : '');
      btn.dataset.cat = cat.id;
      btn.innerHTML = `${cat.label}<span class="count">${cat.count()}</span>`;
      btn.addEventListener('click', () => {
        $$('.filter-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        renderGrid(cat.id);
      });
      wrap.appendChild(btn);
    });

    renderGrid('all');
    renderFaq();
  }

  function renderFaq() {
    const root = document.getElementById('faq-list');
    if (!root || !window.HTX_FAQS) return;
    root.innerHTML = '';
    window.HTX_FAQS.forEach((item, i) => {
      const el = document.createElement('details');
      el.className = 'faq-item';
      if (i === 0) el.open = true;
      el.innerHTML = `
        <summary class="faq-q">
          <span>${item.q}</span>
          <span class="faq-icon"></span>
        </summary>
        <div class="faq-a">${item.a}</div>
      `;
      root.appendChild(el);
    });
  }

  function renderGrid(cat) {
    const grid = $('#skill-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const list = cat === 'all'
      ? window.HTX_SKILLS
      : window.HTX_SKILLS.filter(s => s.category === cat);

    list.forEach(s => {
      const card = document.createElement('a');
      card.className = 'capability-card';
      card.href = `skill.html?slug=${encodeURIComponent(s.slug)}`;
      card.innerHTML = `
        <div class="capability-head">
          <div class="capability-icon">${s.icon}</div>
          <div class="capability-title-wrap">
            <div class="capability-title">${s.name}</div>
          </div>
        </div>
        <div class="capability-desc">${s.desc}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ========== Detail page ==========
  function renderDetail() {
    const wrap = $('#detail-wrap');
    if (!wrap) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const skill = window.HTX_SKILLS.find(s => s.slug === slug);

    if (!skill) {
      wrap.innerHTML = `
        <div class="breadcrumb"><a href="index.html">← Skills</a></div>
        <h1>Skill not found</h1>
        <p>Slug "<code>${slug || ''}</code>" is not in the catalog.</p>`;
      return;
    }

    document.title = `${skill.name} · HTX AI Skills`;

    const ghUrl = `${window.GITHUB_BASE}/${skill.slug}`;
    const tags = (skill.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const scenarios = skill.scenarios || [];
    const catLabel = categoryLabel(skill.category);
    const stats = getSkillStats(skill);

    const scenarioBubbles = scenarios.map(t => `
      <div class="bubble">
        <span class="bubble-avatar">👤</span>
        <span class="bubble-text">&ldquo;${t}&rdquo;</span>
      </div>`).join('');

    const related = window.HTX_SKILLS
      .filter(s => s.slug !== skill.slug && s.category === skill.category)
      .slice(0, 4);
    const relatedHtml = related.length
      ? related.map(r => `<a class="related-card" href="skill.html?slug=${r.slug}">
          <span class="icon">${r.icon}</span>
          <div>
            <b>${r.name}</b>
            <small>${(r.desc || '').slice(0, 28)}…</small>
          </div>
        </a>`).join('')
      : '<p style="color: var(--Text-L3);">—</p>';

    wrap.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">Skills</a> ·
        <a href="index.html#${skill.category}">${catLabel}</a> ·
        <span>${skill.name}</span>
      </div>

      <header class="d-hero">
        <div class="d-hero-left">
          <div class="d-hero-icon">${skill.icon}</div>
          <div class="d-hero-meta">
            <div class="d-hero-tag">${catLabel}</div>
            <h1 class="d-hero-title">${skill.name}</h1>
            <p class="d-hero-desc">${skill.desc}</p>
          </div>
        </div>
        <div class="d-hero-right">
          <div class="d-install">
            <div class="d-install-label">One-line install</div>
            <div class="d-install-cmd">
              <code>${skill.install}</code>
              <button class="copy-btn" data-copy="${skill.install}">Copy</button>
            </div>
            <a class="d-install-link" href="${ghUrl}" target="_blank" rel="noopener">View source on GitHub →</a>
          </div>
        </div>
      </header>

      <section class="d-stats">
        ${stats.map(s => `
        <div class="d-stat">
          <div class="d-stat-icon">${s.icon}</div>
          <div><div class="d-stat-label">${s.label}</div><div class="d-stat-value">${s.value}</div></div>
        </div>`).join('')}
      </section>

      ${scenarios.length ? `
      <section class="d-block">
        <h2 class="d-block-title">Typical User Queries</h2>
        <p class="d-block-sub">Say any of these to your AI Agent and it will automatically pick this Skill to handle the task.</p>
        <div class="d-bubbles">${scenarioBubbles}</div>
      </section>` : ''}

      <section class="d-block">
        <h2 class="d-block-title">Three Steps to Get Started</h2>
        <div class="d-steps">
          <div class="d-step">
            <div class="d-step-num">1</div>
            <div class="d-step-body">
              <div class="d-step-title">Install the Skill</div>
              <div class="d-step-desc">Run the install command in your AI Agent terminal — done in about 5 seconds.</div>
            </div>
          </div>
          <div class="d-step">
            <div class="d-step-num">2</div>
            <div class="d-step-body">
              <div class="d-step-title">Ask in Natural Language</div>
              <div class="d-step-desc">Just tell your AI Agent what you want in plain English — no commands to memorize.</div>
            </div>
          </div>
          <div class="d-step">
            <div class="d-step-num">3</div>
            <div class="d-step-body">
              <div class="d-step-title">AI Executes Automatically</div>
              <div class="d-step-desc">The AI calls this Skill to pull live HTX data and returns structured results.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="d-block">
        <h2 class="d-block-title">Tags</h2>
        <div class="tag-cloud">${tags}</div>
      </section>

      <section class="d-block">
        <h2 class="d-block-title">Related Skills</h2>
        <div class="related-grid">${relatedHtml}</div>
      </section>

      <section class="d-block">
        <h2 class="d-block-title">Full Documentation</h2>
        <div class="d-cta">
          <p class="d-block-sub">SKILL.md / README / references — all on GitHub.</p>
          <div class="d-cta-row">
            <a class="btn btn-primary" href="${ghUrl}" target="_blank" rel="noopener">View on GitHub</a>
            <a class="btn btn-secondary" href="${ghUrl}/SKILL.md" target="_blank" rel="noopener">README</a>
            <a class="btn btn-secondary" href="https://www.npmjs.com/package/@sheerl/htx-cli" target="_blank" rel="noopener">NPM Package</a>
          </div>
        </div>
      </section>
    `;

    $$('.copy-btn').forEach(b => {
      b.addEventListener('click', e => {
        e.preventDefault();
        navigator.clipboard.writeText(b.dataset.copy);
        const orig = b.textContent;
        b.textContent = 'Copied ✓';
        setTimeout(() => (b.textContent = orig), 1400);
      });
    });
  }

  function categoryLabel(c) {
    const m = window.HTX_CATEGORIES.find(x => x.id === c);
    return m ? m.label : c;
  }

  function getSkillStats(skill) {
    const tags = skill.tags || [];
    const isTrading = tags.includes('Order Placement') || tags.includes('Futures Orders') || tags.includes('High Risk');
    const isAccount = skill.auth && !isTrading;
    const isAnalyst = skill.category === 'analyst';

    const stats = [
      {
        icon: skill.auth ? '🔐' : '🌐',
        label: 'Permissions',
        value: skill.auth ? 'API Key Required' : 'No Auth Required',
      },
      {
        icon: '💻',
        label: 'Runtime',
        value: 'Local / Data Stays On-Device',
      },
    ];

    if (isTrading) {
      stats.push({ icon: '🔒', label: 'Order Actions', value: 'Manual Confirmation Enforced' });
    } else if (isAccount) {
      stats.push({ icon: '🛡️', label: 'Fund Transfers', value: 'Manual Confirmation Enforced' });
    } else if (isAnalyst) {
      stats.push({ icon: '🧮', label: 'Compute', value: 'Local, Open-Source, Auditable' });
    } else {
      stats.push({ icon: '⚡', label: 'Freshness', value: 'Real-Time REST Pulls' });
    }

    return stats;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    renderDetail();
  });
})();
