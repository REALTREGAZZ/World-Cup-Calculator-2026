// main.js - Lógica completa del simulador con repescas interactivas

// ==========================================
// ESTADO GLOBAL
// ==========================================
let currentModalMatchId = null;
let playoffsResolved = false;
let currentKnockoutMatch = null;
let playoffResults = {};

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Aplicar idioma guardado
    updateAllTranslations();
    updateLanguageButtons();
    renderPlayoffs();
});

// ==========================================
// PANTALLA DE INICIO Y AJUSTES
// ==========================================

function startTournament() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
}

function showSettings() {
    document.getElementById('settings-screen').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settings-screen').style.display = 'none';
    updateLanguageButtons();
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// Override setLanguage from translations.js
window.setLanguage = function (lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('worldcup2026_language', lang);
        updateAllTranslations();
        updateLanguageButtons();
    }
}

// ==========================================
// REPESCAS INTERACTIVAS
// ==========================================

function renderPlayoffs() {
    const container = document.getElementById('playoffs-container');
    container.innerHTML = '';

    const playoffGroups = [
        { id: 'UEFA_D', nameKey: 'uefaRouteD', teams: playoffs.UEFA_D },
        { id: 'UEFA_A', nameKey: 'uefaRouteA', teams: playoffs.UEFA_A },
        { id: 'UEFA_C', nameKey: 'uefaRouteC', teams: playoffs.UEFA_C },
        { id: 'UEFA_B', nameKey: 'uefaRouteB', teams: playoffs.UEFA_B },
        { id: 'FIFA_B', nameKey: 'fifaPlayoffB', teams: playoffs.FIFA_B },
        { id: 'FIFA_A', nameKey: 'fifaPlayoffA', teams: playoffs.FIFA_A }
    ];

    playoffGroups.forEach(pg => {
        const card = document.createElement('div');
        card.className = 'group-card';

        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerHTML = `<span class="group-title">${t(pg.nameKey)}</span>`;

        if (playoffResults[pg.id]) {
            const winner = teams[playoffResults[pg.id]];
            header.innerHTML += `<span style="color: #22c55e; font-size: 0.85rem;">✅ ${winner.name}</span>`;
        }

        card.appendChild(header);

        // Lista de equipos candidatos
        const teamsList = document.createElement('div');
        teamsList.style.marginBottom = '1rem';

        pg.teams.forEach(teamId => {
            const team = teams[teamId];
            const isWinner = playoffResults[pg.id] === teamId;

            const teamEl = document.createElement('div');
            teamEl.className = 'playoff-team-item';
            teamEl.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                background: ${isWinner ? 'rgba(34, 197, 94, 0.15)' : 'rgba(15, 23, 42, 0.5)'};
                border-radius: 8px;
                margin-bottom: 0.5rem;
                border: 1px solid ${isWinner ? '#22c55e' : '#334155'};
                transition: all 0.2s;
            `;

            teamEl.innerHTML = `
                <img src="${team.flag}" class="team-flag" alt="${team.name}">
                <span style="flex: 1;">${team.name}</span>
                <span style="font-size: 0.75rem; color: #64748b;">Rating: ${team.rating}</span>
                ${isWinner ? '<span style="color: #22c55e;">✓</span>' : ''}
            `;

            teamEl.onclick = () => selectPlayoffWinner(pg.id, teamId);
            teamsList.appendChild(teamEl);
        });

        card.appendChild(teamsList);

        // Botón de simular esta repesca
        const simBtn = document.createElement('button');
        simBtn.className = 'btn-secondary';
        simBtn.style.width = '100%';
        simBtn.innerHTML = `🎲 ${t('simulateThis')}`;
        simBtn.onclick = () => simulateSinglePlayoff(pg.id);
        card.appendChild(simBtn);

        container.appendChild(card);
    });

    updateFinishButton();
}

function selectPlayoffWinner(playoffId, teamId) {
    playoffResults[playoffId] = teamId;
    renderPlayoffs();
}

function simulateSinglePlayoff(playoffId) {
    const candidates = playoffs[playoffId];
    let best = candidates[0];
    let bestScore = teams[best].rating + (Math.random() * 10 - 5);

    candidates.forEach(teamId => {
        const score = teams[teamId].rating + (Math.random() * 10 - 5);
        if (score > bestScore) {
            bestScore = score;
            best = teamId;
        }
    });

    playoffResults[playoffId] = best;
    renderPlayoffs();
}

function simulateAllPlayoffs() {
    for (let playoffId in playoffs) {
        if (!playoffResults[playoffId]) {
            simulateSinglePlayoff(playoffId);
        }
    }
}

function updateFinishButton() {
    const btn = document.getElementById('finish-playoffs-btn');
    const allResolved = Object.keys(playoffs).every(id => playoffResults[id]);

    btn.disabled = !allResolved;
    btn.style.opacity = allResolved ? '1' : '0.5';
}

function finishPlayoffsAndContinue() {
    // Reemplazar placeholders en grupos
    for (let gId in groups) {
        groups[gId].teams = groups[gId].teams.map(teamId => {
            if (teamId.startsWith('UEFA_') || teamId.startsWith('FIFA_')) {
                return playoffResults[teamId];
            }
            return teamId;
        });
    }

    playoffsResolved = true;
    initializeGroups();

    // Habilitar toda la navegación
    document.getElementById('groups-nav-btn').disabled = false;
    document.getElementById('knockout-nav-btn').disabled = false;
    document.getElementById('stats-nav-btn').disabled = false;

    showSection('groups');
    renderGroups();
}

function initializeGroups() {
    for (let gId in groups) {
        const teamIds = groups[gId].teams;

        groups[gId].matches = [
            { id: `${gId}1`, p1: teamIds[0], p2: teamIds[1], g1: null, g2: null, played: false },
            { id: `${gId}2`, p1: teamIds[2], p2: teamIds[3], g1: null, g2: null, played: false },
            { id: `${gId}3`, p1: teamIds[0], p2: teamIds[2], g1: null, g2: null, played: false },
            { id: `${gId}4`, p1: teamIds[1], p2: teamIds[3], g1: null, g2: null, played: false },
            { id: `${gId}5`, p1: teamIds[0], p2: teamIds[3], g1: null, g2: null, played: false },
            { id: `${gId}6`, p1: teamIds[1], p2: teamIds[2], g1: null, g2: null, played: false }
        ];

        groups[gId].standings = teamIds.map(teamId => ({
            team: teamId,
            pts: 0, gf: 0, ga: 0, gd: 0,
            played: 0, won: 0, drawn: 0, lost: 0,
            yellowCards: 0
        }));
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(sectionId).classList.add('active-section');

    const btnMap = { 'playoffs': 0, 'groups': 1, 'knockout': 2, 'stats': 3 };
    const navBtns = document.querySelectorAll('.nav-btn');
    if (navBtns[btnMap[sectionId]]) {
        navBtns[btnMap[sectionId]].classList.add('active');
    }
}

// ==========================================
// RENDERIZADO GRUPOS
// ==========================================

function renderGroups() {
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    for (let gId in groups) {
        const group = groups[gId];

        const card = document.createElement('div');
        card.className = 'group-card';

        card.innerHTML = `
            <div class="group-header">
                <span class="group-title">${t('group')} ${gId}</span>
            </div>
        `;

        const table = document.createElement('table');
        table.className = 'standings-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Equipo</th>
                    <th>${t('points')}</th>
                    <th>${t('goalDiff')}</th>
                    <th>${t('goalsFor')}</th>
                </tr>
            </thead>
            <tbody id="tbody-${gId}"></tbody>
        `;
        card.appendChild(table);

        const matchesDiv = document.createElement('div');
        matchesDiv.className = 'group-matches';

        group.matches.forEach(m => {
            const t1 = teams[m.p1];
            const t2 = teams[m.p2];

            const mEl = document.createElement('div');
            mEl.className = 'match-item';
            mEl.onclick = () => openMatchModal(m.id, gId, false);

            mEl.innerHTML = `
                <div class="match-teams">
                    <div class="match-team-row">
                        <img src="${t1.flag}" class="team-flag" alt="${t1.name}">
                        <span>${t1.name}</span>
                        <span class="match-score" id="score-${m.id}-1">${m.g1 !== null ? m.g1 : '-'}</span>
                    </div>
                    <div class="match-team-row">
                        <img src="${t2.flag}" class="team-flag" alt="${t2.name}">
                        <span>${t2.name}</span>
                        <span class="match-score" id="score-${m.id}-2">${m.g2 !== null ? m.g2 : '-'}</span>
                    </div>
                </div>
                <div class="match-status">${m.played ? 'F' : '...'}</div>
            `;
            matchesDiv.appendChild(mEl);
        });

        card.appendChild(matchesDiv);
        container.appendChild(card);
    }

    updateStandingsUI();
}

function updateStandingsUI() {
    for (let gId in groups) {
        const tbody = document.getElementById(`tbody-${gId}`);
        if (!tbody) continue;

        calculateGroupStandings(gId);
        const sorted = groups[gId].standings;

        tbody.innerHTML = sorted.map((row, index) => {
            const t = teams[row.team];
            const isQualified = index < 2;
            const isThird = index === 2;

            let rowClass = '';
            if (isQualified) rowClass = 'style="background: rgba(34, 197, 94, 0.1)"';
            if (isThird) rowClass = 'style="background: rgba(234, 179, 8, 0.1)"';

            return `
                <tr ${rowClass}>
                    <td class="team-cell">
                        <span style="color: #64748b; font-size: 0.8rem; width: 15px;">${index + 1}</span>
                        <img src="${t.flag}" class="team-flag" alt="${t.name}">
                        <span>${t.code}</span>
                    </td>
                    <td><b>${row.pts}</b></td>
                    <td>${row.gd > 0 ? '+' + row.gd : row.gd}</td>
                    <td>${row.gf}</td>
                </tr>
            `;
        }).join('');
    }

    updateBestThirdsUI();

    // Auto-generar knockout si todos los grupos están completos
    if (checkGroupsComplete() && !knockoutGenerated) {
        generateKnockoutBracket();

        // Mostrar notificación de que el bracket está listo
        setTimeout(() => {
            const message = `✅ ${t('groupsCompleteTitle')}\n\n${t('groupsCompleteMsg')}`;
            if (confirm(message)) {
                showSection('knockout');
            }
        }, 500);
    }
}

function updateBestThirdsUI() {
    const thirds = getBestThirdPlaces();
    const tbody = document.getElementById('best-thirds-body');
    if (!tbody) return;

    tbody.innerHTML = thirds.map((row, index) => {
        const t = teams[row.team];
        const isQualified = index < 8;
        return `
            <tr style="${isQualified ? 'background: rgba(34, 197, 94, 0.1)' : ''}">
                <td class="team-cell">
                    <span style="color: #64748b; font-size: 0.8rem; width: 15px;">${index + 1}</span>
                    <img src="${t.flag}" class="team-flag" alt="${t.name}">
                    <span>${t.code} (${row.group})</span>
                </td>
                <td><b>${row.pts}</b></td>
                <td>${row.gd > 0 ? '+' + row.gd : row.gd}</td>
                <td>${row.gf}</td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// LÓGICA DE CÁLCULO
// ==========================================

function calculateGroupStandings(gId) {
    const group = groups[gId];

    group.standings.forEach(s => {
        s.pts = 0; s.gf = 0; s.ga = 0; s.gd = 0;
        s.won = 0; s.drawn = 0; s.lost = 0; s.played = 0;
    });

    group.matches.forEach(m => {
        if (m.played) {
            const s1 = group.standings.find(s => s.team === m.p1);
            const s2 = group.standings.find(s => s.team === m.p2);

            s1.played++; s2.played++;
            s1.gf += m.g1; s1.ga += m.g2; s1.gd = s1.gf - s1.ga;
            s2.gf += m.g2; s2.ga += m.g1; s2.gd = s2.gf - s2.ga;

            if (m.g1 > m.g2) {
                s1.pts += 3; s1.won++; s2.lost++;
            } else if (m.g1 < m.g2) {
                s2.pts += 3; s2.won++; s1.lost++;
            } else {
                s1.pts += 1; s2.pts += 1; s1.drawn++; s2.drawn++;
            }
        }
    });

    group.standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if (a.yellowCards !== b.yellowCards) return a.yellowCards - b.yellowCards;
        return Math.random() - 0.5;
    });
}

function getBestThirdPlaces() {
    let allThirds = [];
    for (let gId in groups) {
        if (groups[gId].standings.length > 2) {
            allThirds.push({ ...groups[gId].standings[2], group: gId });
        }
    }

    return allThirds.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if (a.yellowCards !== b.yellowCards) return a.yellowCards - b.yellowCards;
        return Math.random() - 0.5;
    });
}

// ==========================================
// SIMULACIÓN
// ==========================================

function simulateMatchLogic(team1Id, team2Id, isKnockout = false) {
    const t1 = teams[team1Id];
    const t2 = teams[team2Id];

    const ratingDiff = t1.rating - t2.rating;

    let lambda1 = 1.3 + (ratingDiff / 20);
    let lambda2 = 1.3 - (ratingDiff / 20);

    if (lambda1 < 0.2) lambda1 = 0.2;
    if (lambda2 < 0.2) lambda2 = 0.2;

    const g1 = poisson(lambda1);
    const g2 = poisson(lambda2);

    let result = { g1, g2, penalties: null, winner: null };

    result.yellowCards1 = Math.floor(Math.random() * 3);
    result.yellowCards2 = Math.floor(Math.random() * 3);

    if (isKnockout && g1 === g2) {
        let p1 = 0, p2 = 0;
        for (let i = 0; i < 5; i++) {
            if (Math.random() > 0.2) p1++;
            if (Math.random() > 0.2) p2++;
        }
        while (p1 === p2) {
            if (Math.random() > 0.2) p1++;
            if (Math.random() > 0.2) p2++;
        }
        result.penalties = { p1, p2 };
        result.winner = p1 > p2 ? team1Id : team2Id;
    } else if (g1 > g2) {
        result.winner = team1Id;
    } else if (g2 > g1) {
        result.winner = team2Id;
    }

    tournamentStats.totalMatches++;
    tournamentStats.totalGoals += g1 + g2;

    return result;
}

function poisson(lambda) {
    let L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

// ==========================================
// INTERACCIÓN - MODAL
// ==========================================

function openMatchModal(matchId, groupId, isKnockout) {
    currentModalMatchId = { id: matchId, group: groupId, isKnockout };

    let match;
    if (isKnockout) {
        match = currentKnockoutMatch;
        document.getElementById('penalty-section').style.display = 'block';
    } else {
        const group = groups[groupId];
        match = group.matches.find(m => m.id === matchId);
        document.getElementById('penalty-section').style.display = 'none';
    }

    const t1 = teams[match.home || match.p1];
    const t2 = teams[match.away || match.p2];

    document.getElementById('modal-flag-1').src = t1.flag;
    document.getElementById('modal-flag-2').src = t2.flag;
    document.getElementById('modal-name-1').innerText = t1.name;
    document.getElementById('modal-name-2').innerText = t2.name;

    document.getElementById('score-1').value = match.played ? match.g1 : '';
    document.getElementById('score-2').value = match.played ? match.g2 : '';

    if (isKnockout && match.penalties) {
        document.getElementById('pen-1').value = match.penalties.p1;
        document.getElementById('pen-2').value = match.penalties.p2;
    } else {
        document.getElementById('pen-1').value = '';
        document.getElementById('pen-2').value = '';
    }

    document.getElementById('match-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('match-modal').style.display = 'none';
    currentModalMatchId = null;
    currentKnockoutMatch = null;
}

function saveMatchResult() {
    if (!currentModalMatchId) return;

    const s1 = parseInt(document.getElementById('score-1').value);
    const s2 = parseInt(document.getElementById('score-2').value);

    if (isNaN(s1) || isNaN(s2)) return;

    if (currentModalMatchId.isKnockout) {
        // Guardar resultado de knockout
        const match = currentKnockoutMatch;
        match.g1 = s1;
        match.g2 = s2;
        match.played = true;

        if (s1 === s2) {
            const p1 = parseInt(document.getElementById('pen-1').value) || 0;
            const p2 = parseInt(document.getElementById('pen-2').value) || 0;

            if (p1 === p2) {
                alert(t('penaltiesCantTie'));
                return;
            }

            match.penalties = { p1, p2 };
            match.winner = p1 > p2 ? match.home : match.away;
            match.winnerGroup = p1 > p2 ? match.homeGroup : match.awayGroup;
        } else {
            match.winner = s1 > s2 ? match.home : match.away;
            match.winnerGroup = s1 > s2 ? match.homeGroup : match.awayGroup;
            match.penalties = null;
        }

        // Re-renderizar bracket
        const roundId = match.roundId;
        if (roundId) {
            // Para final y tercer puesto, pasamos el partido como array
            if (roundId === 'third-place-match') {
                renderBracketRound(roundId, [knockoutBracket.thirdPlace]);
            } else if (roundId === 'final-match') {
                renderBracketRound(roundId, [knockoutBracket.final]);
                // Actualizar campeón si la final está completa
                if (knockoutBracket.final.winner && knockoutBracket.thirdPlace && knockoutBracket.thirdPlace.winner) {
                    setTimeout(() => {
                        showChampion(knockoutBracket.final.winner);
                    }, 300);
                }
            } else {
                renderBracketRound(roundId, knockoutBracket[roundId]);
            }
        }

        // Verificar si la ronda está completa y avanzar automáticamente
        checkAndAdvanceRound(roundId);

    } else {
        // Guardar resultado de grupo
        const group = groups[currentModalMatchId.group];
        const match = group.matches.find(m => m.id === currentModalMatchId.id);

        match.g1 = s1;
        match.g2 = s2;
        match.played = true;

        const s1obj = group.standings.find(s => s.team === match.p1);
        const s2obj = group.standings.find(s => s.team === match.p2);
        s1obj.yellowCards += Math.floor(Math.random() * 2);
        s2obj.yellowCards += Math.floor(Math.random() * 2);

        renderGroups();
    }

    closeModal();
}

function simulateSingleMatchFromModal() {
    if (!currentModalMatchId) return;

    let p1, p2;

    if (currentModalMatchId.isKnockout) {
        p1 = currentKnockoutMatch.home;
        p2 = currentKnockoutMatch.away;
    } else {
        const group = groups[currentModalMatchId.group];
        const match = group.matches.find(m => m.id === currentModalMatchId.id);
        p1 = match.p1;
        p2 = match.p2;
    }

    const res = simulateMatchLogic(p1, p2, currentModalMatchId.isKnockout);

    document.getElementById('score-1').value = res.g1;
    document.getElementById('score-2').value = res.g2;

    if (currentModalMatchId.isKnockout && res.penalties) {
        document.getElementById('pen-1').value = res.penalties.p1;
        document.getElementById('pen-2').value = res.penalties.p2;
    }
}

function simulateAllGroups() {
    if (!playoffsResolved) {
        alert(t('resolvePlayoffsFirst'));
        return;
    }

    for (let gId in groups) {
        groups[gId].matches.forEach(m => {
            if (!m.played) {
                const res = simulateMatchLogic(m.p1, m.p2);
                m.g1 = res.g1;
                m.g2 = res.g2;
                m.played = true;

                const s1 = groups[gId].standings.find(s => s.team === m.p1);
                const s2 = groups[gId].standings.find(s => s.team === m.p2);
                s1.yellowCards += res.yellowCards1;
                s2.yellowCards += res.yellowCards2;
            }
        });
    }
    renderGroups();

    renderGroups();
}

function resetTournament() {
    if (!confirm(t('confirmReset'))) return;
    location.reload();
}

// ==========================================
// ELIMINATORIAS
// ==========================================

let knockoutGenerated = false;

// Verifica si todos los partidos de grupos están jugados
function checkGroupsComplete() {
    for (let g in groups) {
        if (groups[g].matches.some(m => !m.played)) {
            return false;
        }
    }
    return true;
}

// Genera el bracket de knockout con la estructura personalizada
function findThirdPlacePairings(slots, thirds) {
    const pairings = {};
    const usedThirds = new Set();

    function solve(index) {
        if (index === slots.length) {
            return true;
        }

        const slot = slots[index];

        // Intentar encontrar un tercero válido para este slot
        for (let i = 0; i < thirds.length; i++) {
            const third = thirds[i];
            if (!usedThirds.has(third.team) && slot.allowed.has(third.group)) {
                pairings[slot.id] = third;
                usedThirds.add(third.team);

                if (solve(index + 1)) {
                    return true;
                }

                delete pairings[slot.id];
                usedThirds.delete(third.team);
            }
        }
        return false;
    }

    if (solve(0)) {
        return pairings;
    } else {
        console.warn("No se pudo encontrar una asignación perfecta de terceros. Usando fallback.");
        // Fallback: asignar el primer disponible que no sea de su propio grupo (si es posible)
        const availableThirds = [...thirds];
        const localPairings = {};

        for (const slot of slots) {
            let foundIndex = -1;
            // Preferir uno permitido
            foundIndex = availableThirds.findIndex(t => slot.allowed.has(t.group));

            // Si no, cualquiera que no sea de su grupo
            if (foundIndex === -1) {
                foundIndex = availableThirds.findIndex(t => t.group !== slot.group);
            }

            // Si no, el primero que haya
            if (foundIndex === -1) foundIndex = 0;

            if (foundIndex !== -1) {
                localPairings[slot.id] = availableThirds[foundIndex];
                availableThirds.splice(foundIndex, 1);
            }
        }
        return localPairings;
    }
}

function generateKnockoutBracket() {
    if (knockoutGenerated) return;

    // 1. Obtener clasificados
    const firsts = {};
    const seconds = {};
    let thirds = [];
    for (let gId in groups) {
        calculateGroupStandings(gId);
        const standings = groups[gId].standings;
        firsts[gId] = { ...standings[0], place: 1, group: gId, team: standings[0].team };
        seconds[gId] = { ...standings[1], place: 2, group: gId, team: standings[1].team };
        if (standings.length > 2) {
            thirds.push({ ...standings[2], place: 3, group: gId, team: standings[2].team });
        }
    }

    // Ordenar y seleccionar mejores terceros
    thirds.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return Math.random() - 0.5;
    });
    const bestThirds = thirds.slice(0, 8);

    // 2. Definir los slots que requieren terceros según la tabla del usuario
    const thirdPlaceSlots = [
        { id: 'R32-1', host: firsts['A'], allowed: new Set(['C', 'D', 'E']) },
        { id: 'R32-2', host: firsts['B'], allowed: new Set(['A', 'C', 'F']) },
        { id: 'R32-5', host: firsts['E'], allowed: new Set(['B', 'F', 'H']) },
        { id: 'R32-8', host: firsts['H'], allowed: new Set(['D', 'E', 'I']) },
        { id: 'R32-11', host: firsts['K'], allowed: new Set(['G', 'H', 'L']) },
        { id: 'R32-13', host: seconds['A'], allowed: new Set(['B', 'C', 'D']) },
        { id: 'R32-14', host: seconds['B'], allowed: new Set(['E', 'F', 'G']) },
        { id: 'R32-16', host: seconds['L'], allowed: new Set(['I', 'J', 'K']) } // Asumido 2L (usuario dijo 2F pero ya estaba en uso)
    ];

    // Resolver emparejamientos de terceros
    const thirdAssignments = findThirdPlacePairings(thirdPlaceSlots, bestThirds);

    // 3. Construir los 16 partidos en orden exacto
    const createMatch = (id, t1, t2) => ({
        id: id,
        home: t1.team, away: t2.team,
        homeGroup: t1.group, awayGroup: t2.group,
        g1: null, g2: null, played: false, winner: null, winnerGroup: null, roundId: 'r32'
    });

    const matches = [];

    // R32-1: Ganador A vs 3ro (C/D/E)
    matches.push(createMatch('R32_1', firsts['A'], thirdAssignments['R32-1']));

    // R32-2: Ganador B vs 3ro (A/C/F)
    matches.push(createMatch('R32_2', firsts['B'], thirdAssignments['R32-2']));

    // R32-3: Ganador C vs Segundo D
    matches.push(createMatch('R32_3', firsts['C'], seconds['D']));

    // R32-4: Ganador D vs Segundo C
    matches.push(createMatch('R32_4', firsts['D'], seconds['C']));

    // R32-5: Ganador E vs 3ro (B/F/H)
    matches.push(createMatch('R32_5', firsts['E'], thirdAssignments['R32-5']));

    // R32-6: Ganador F vs Segundo G
    matches.push(createMatch('R32_6', firsts['F'], seconds['G']));

    // R32-7: Ganador G vs Segundo F
    matches.push(createMatch('R32_7', firsts['G'], seconds['F']));

    // R32-8: Ganador H vs 3ro (D/E/I)
    matches.push(createMatch('R32_8', firsts['H'], thirdAssignments['R32-8']));

    // R32-9: Ganador I vs Segundo J
    matches.push(createMatch('R32_9', firsts['I'], seconds['J']));

    // R32-10: Ganador J vs Segundo I
    matches.push(createMatch('R32_10', firsts['J'], seconds['I']));

    // R32-11: Ganador K vs 3ro (G/H/L)
    matches.push(createMatch('R32_11', firsts['K'], thirdAssignments['R32-11']));

    // R32-12: Ganador L vs Segundo K
    matches.push(createMatch('R32_12', firsts['L'], seconds['K']));

    // R32-13: Segundo A vs 3ro (B/C/D)
    matches.push(createMatch('R32_13', seconds['A'], thirdAssignments['R32-13']));

    // R32-14: Segundo B vs 3ro (E/F/G)
    matches.push(createMatch('R32_14', seconds['B'], thirdAssignments['R32-14']));

    // R32-15: Segundo E vs Segundo H
    matches.push(createMatch('R32_15', seconds['E'], seconds['H']));

    // R32-16: Segundo L (Asumido) vs 3ro (I/J/K)
    matches.push(createMatch('R32_16', seconds['L'], thirdAssignments['R32-16']));

    // 4. Guardar y renderizar
    knockoutBracket.r32 = matches;
    renderBracketRound('r32', knockoutBracket.r32);
    knockoutGenerated = true;
    updateKnockoutButton();
}

// Actualizar el texto del botón de knockout según el estado
function updateKnockoutButton() {
    const btn = document.querySelector('#knockout .btn-primary');
    if (btn) {
        if (knockoutGenerated) {
            btn.innerHTML = `⚡ <span data-i18n="simulateKnockout">${t('simulateKnockout')}</span>`;
        }
    }
}

// Simular TODOS los knockouts automáticamente
function simulateAllKnockout() {
    if (!knockoutGenerated) {
        alert(t('finishGroupsFirst'));
        return;
    }

    showSection('knockout');

    // Simular Round of 32
    simulateRound('r32', () => {
        setupNextRound('r16', knockoutBracket.r32);
        simulateRound('r16', () => {
            setupNextRound('qf', knockoutBracket.r16);
            simulateRound('qf', () => {
                setupNextRound('sf', knockoutBracket.qf);
                simulateRound('sf', () => {
                    setupFinals(knockoutBracket.sf, true); // true = auto-simular

                    // Scroll to finals content
                    const finalsContent = document.getElementById('finals-content');
                    if (finalsContent) {
                        finalsContent.style.display = 'flex';
                        finalsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        });
    });
}

// Función para avanzar a knockout (genera bracket si no existe)
function goToKnockout() {
    if (!checkGroupsComplete()) {
        alert(t('finishGroupsFirst'));
        return;
    }

    if (!knockoutGenerated) {
        generateKnockoutBracket();
    }

    showSection('knockout');
}

// Verificar si una ronda está completa y avanzar automáticamente
function checkAndAdvanceRound(roundId) {
    // No hacer nada para finales (ya están completas)
    if (roundId === 'third-place-match' || roundId === 'final-match') {
        return;
    }

    const matches = knockoutBracket[roundId];
    if (!matches) return;

    // Verificar si todos los partidos de esta ronda están jugados
    const allPlayed = matches.every(m => m.played && m.winner);

    if (allPlayed) {
        // Avanzar a la siguiente ronda
        setTimeout(() => {
            if (roundId === 'r32') {
                setupNextRound('r16', knockoutBracket.r32);
                showRoundCompleteMessage('r32', 'r16');
            } else if (roundId === 'r16') {
                setupNextRound('qf', knockoutBracket.r16);
                showRoundCompleteMessage('r16', 'qf');
            } else if (roundId === 'qf') {
                setupNextRound('sf', knockoutBracket.qf);
                showRoundCompleteMessage('qf', 'sf');
            } else if (roundId === 'sf') {
                setupFinals(knockoutBracket.sf, false); // false = no auto-simular
                // Mostrar contenedor de finales
                const finalsContent = document.getElementById('finals-content');
                if (finalsContent) {
                    finalsContent.style.display = 'flex';
                    finalsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 300);
    }
}

// Mostrar mensaje cuando se completa una ronda
function showRoundCompleteMessage(completedRound, nextRound) {
    const roundNames = {
        'r32': t('roundOf32'),
        'r16': t('roundOf16'),
        'qf': t('quarterFinals'),
        'sf': t('semiFinals'),
        'finals': t('finals')
    };

    const completedName = roundNames[completedRound] || completedRound;
    const nextName = roundNames[nextRound] || nextRound;

    // Scroll suave a la siguiente ronda
    setTimeout(() => {
        const nextContainer = document.getElementById(`${nextRound === 'finals' ? 'finals' : nextRound}-container`);
        if (nextContainer) {
            nextContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 500);
}

function renderBracketRound(roundId, matches) {
    const container = document.getElementById(`${roundId}-matches`);
    container.innerHTML = '';

    matches.forEach(m => {
        const t1 = teams[m.home];
        const t2 = teams[m.away];

        const el = document.createElement('div');
        el.className = 'match-item';
        el.onclick = () => {
            currentKnockoutMatch = m;
            openMatchModal(m.id, null, true);
        };

        el.innerHTML = `
            <div class="match-teams">
                <div class="match-team-row">
                    <img src="${t1.flag}" class="team-flag" alt="${t1.name}">
                    <span>${t1.name}</span>
                    <span class="match-score">${m.g1 !== null ? m.g1 : ''}</span>
                </div>
                <div class="match-team-row">
                    <img src="${t2.flag}" class="team-flag" alt="${t2.name}">
                    <span>${t2.name}</span>
                    <span class="match-score">${m.g2 !== null ? m.g2 : ''}</span>
                </div>
            </div>
            ${m.penalties ? `<div class="match-status" style="font-size:0.6rem; color:#eab308">PEN ${m.penalties.p1}-${m.penalties.p2}</div>` : ''}
        `;
        container.appendChild(el);
    });
}

function simulateRound(roundId, callback) {
    const matches = knockoutBracket[roundId];

    matches.forEach(m => {
        if (!m.played) {
            const res = simulateMatchLogic(m.home, m.away, true);
            m.g1 = res.g1;
            m.g2 = res.g2;
            m.played = true;
            m.winner = res.winner;
            m.penalties = res.penalties;
            // Asignar el grupo del ganador
            m.winnerGroup = (m.winner === m.home) ? m.homeGroup : m.awayGroup;
        }
    });

    renderBracketRound(roundId, matches);
    setTimeout(callback, 800);
}

function setupNextRound(nextRoundId, prevMatches) {
    knockoutBracket[nextRoundId] = [];
    for (let i = 0; i < prevMatches.length; i += 2) {
        const match1 = prevMatches[i];
        const match2 = prevMatches[i + 1];

        knockoutBracket[nextRoundId].push({
            id: `${nextRoundId}_${(i / 2) + 1}`,
            roundId: nextRoundId,
            home: match1.winner,
            away: match2.winner,
            homeGroup: match1.winnerGroup,
            awayGroup: match2.winnerGroup,
            g1: null, g2: null, played: false, winner: null, winnerGroup: null
        });
    }
    renderBracketRound(nextRoundId, knockoutBracket[nextRoundId]);
}

function setupFinals(sfMatches, autoSimulate = false) {
    const loser1 = sfMatches[0].winner === sfMatches[0].home ? sfMatches[0].away : sfMatches[0].home;
    const loser2 = sfMatches[1].winner === sfMatches[1].home ? sfMatches[1].away : sfMatches[1].home;
    const loser1Group = sfMatches[0].winner === sfMatches[0].home ? sfMatches[0].awayGroup : sfMatches[0].homeGroup;
    const loser2Group = sfMatches[1].winner === sfMatches[1].home ? sfMatches[1].awayGroup : sfMatches[1].homeGroup;

    // Crear partido de tercer puesto
    if (!knockoutBracket.thirdPlace) {
        knockoutBracket.thirdPlace = {
            id: '3RD',
            roundId: 'third-place-match',
            home: loser1,
            away: loser2,
            homeGroup: loser1Group,
            awayGroup: loser2Group,
            g1: null, g2: null, played: false, winner: null, winnerGroup: null
        };
    }

    // Solo simular si autoSimulate es true
    if (autoSimulate && !knockoutBracket.thirdPlace.played) {
        const res3 = simulateMatchLogic(knockoutBracket.thirdPlace.home, knockoutBracket.thirdPlace.away, true);
        knockoutBracket.thirdPlace.g1 = res3.g1;
        knockoutBracket.thirdPlace.g2 = res3.g2;
        knockoutBracket.thirdPlace.winner = res3.winner;
        knockoutBracket.thirdPlace.penalties = res3.penalties;
        knockoutBracket.thirdPlace.winnerGroup = (res3.winner === knockoutBracket.thirdPlace.home) ? loser1Group : loser2Group;
        knockoutBracket.thirdPlace.played = true;
    }

    renderBracketRound('third-place-match', [knockoutBracket.thirdPlace]);

    // Crear partido final
    setTimeout(() => {
        if (!knockoutBracket.final) {
            knockoutBracket.final = {
                id: 'FINAL',
                roundId: 'final-match',
                home: sfMatches[0].winner,
                away: sfMatches[1].winner,
                homeGroup: sfMatches[0].winnerGroup,
                awayGroup: sfMatches[1].winnerGroup,
                g1: null, g2: null, played: false, winner: null, winnerGroup: null
            };
        }

        // Solo simular si autoSimulate es true
        if (autoSimulate && !knockoutBracket.final.played) {
            const resF = simulateMatchLogic(knockoutBracket.final.home, knockoutBracket.final.away, true);
            knockoutBracket.final.g1 = resF.g1;
            knockoutBracket.final.g2 = resF.g2;
            knockoutBracket.final.winner = resF.winner;
            knockoutBracket.final.penalties = resF.penalties;
            knockoutBracket.final.winnerGroup = (resF.winner === knockoutBracket.final.home) ? sfMatches[0].winnerGroup : sfMatches[1].winnerGroup;
            knockoutBracket.final.played = true;
        }

        renderBracketRound('final-match', [knockoutBracket.final]);

        // Solo mostrar campeón si la final está jugada
        if (knockoutBracket.final.played && knockoutBracket.final.winner) {
            showChampion(knockoutBracket.final.winner);
        }
    }, autoSimulate ? 1000 : 100);
}

function showChampion(winnerId) {
    const team = teams[winnerId];
    const display = document.getElementById('champion-display');

    const runner = knockoutBracket.final.winner === knockoutBracket.final.home ? knockoutBracket.final.away : knockoutBracket.final.home;
    const third = knockoutBracket.thirdPlace.winner;

    display.innerHTML = `
                <div class="champion-animation">
            <img src="${team.flag}" class="big-flag champion-flag" alt="${team.name}">
            <div class="champion-name">${team.name}</div>
            <div class="trophy-icon">🏆</div>
            <div style="color: #94a3b8; margin-top: 0.5rem; font-size: 1.1rem;">${t('worldChampion')}</div>
        </div>
        <div style="margin-top: 2rem; color: #cbd5e1;">
            <p><strong>🥈 ${t('runnerUp')}:</strong> ${teams[runner].name}</p>
            <p><strong>🥉 ${t('thirdPlaceTeam')}:</strong> ${teams[third].name}</p>
        </div>
        <div style="margin-top: 2rem; font-size: 0.9rem; color: #64748b;">
            <p>${t('totalMatches')}: ${tournamentStats.totalMatches}</p>
            <p>${t('totalGoals')}: ${tournamentStats.totalGoals}</p>
            <p>${t('avgGoalsPerMatch')}: ${(tournamentStats.totalGoals / tournamentStats.totalMatches).toFixed(2)}</p>
        </div>
            `;

    createConfetti();
}

// ==========================================
// ANIMACIÓN CONFETTI
// ==========================================

function createConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    const colors = ['#eab308', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}

// Simulación completa automática
function simulateFullTournament() {
    if (!confirm(t('confirmSimulateFull'))) return;

    if (!playoffsResolved) {
        simulateAllPlayoffs();
        finishPlayoffsAndContinue();
    }

    simulateAllGroups();

    setTimeout(() => {
        // Generar bracket si no está generado
        if (!knockoutGenerated) {
            generateKnockoutBracket();
        }
        // Simular todas las eliminatorias
        simulateAllKnockout();
    }, 1500);
}
