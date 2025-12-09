// translations.js - Sistema de traducción multiidioma

const translations = {
    es: {
        // Pantalla de Inicio
        welcome: "Bienvenido al",
        worldCup: "Mundial 2026",
        startButton: "Comenzar",
        settingsButton: "Ajustes",

        // Navegación
        navPlayoffs: "Repescas",
        navGroups: "Grupos",
        navKnockout: "Fase Final",
        navFinals: "Finales",
        navResults: "Resultados",

        // Repescas
        playoffsTitle: "Repescas de Clasificación",
        playoffsDesc: "Resuelve las repescas para completar los 48 equipos clasificados",
        simulateAll: "Simular Todas",
        continueButton: "Continuar al Torneo",
        simulateThis: "Simular esta repesca",
        uefaRouteA: "UEFA - Ruta A",
        uefaRouteB: "UEFA - Ruta B",
        uefaRouteC: "UEFA - Ruta C",
        uefaRouteD: "UEFA - Ruta D",
        fifaPlayoffA: "FIFA Playoff A (1 clasificado)",
        fifaPlayoffB: "FIFA Playoff B (1 clasificado)",

        // Grupos
        simulateGroups: "Simular Grupos",
        resetTournament: "Reiniciar",
        simulateFullTournament: "Simular Mundial Completo",
        group: "Grupo",
        points: "Pts",
        goalDiff: "DG",
        goalsFor: "GF",

        // Fase Final
        simulateKnockout: "Simular Fase Final",
        goToFinalsButton: "Ir a Finales",
        roundOf32: "Dieciseisavos de Final",
        roundOf16: "Octavos de Final",
        quarterFinals: "Cuartos de Final",
        semiFinals: "Semifinales",
        finals: "Finales",
        thirdPlace: "Tercer Puesto",
        final: "Final",
        penalties: "Penaltis",

        // Resultados
        champion2026: "Campeón Mundial 2026",
        completeTournament: "Completa el torneo para ver al campeón",
        bestThirds: "Mejores Terceros Clasificados",
        bestThirdsDesc: "Los 8 mejores terceros avanzan a dieciseisavos",
        completeGroups: "Completa la fase de grupos",
        runnerUp: "Subcampeón",
        thirdPlaceTeam: "Tercer Lugar",
        worldChampion: "¡CAMPEÓN DEL MUNDO 2026!",
        totalMatches: "Total de partidos",
        totalGoals: "Total de goles",
        avgGoalsPerMatch: "Promedio de goles/partido",

        // Modal
        editMatch: "Editar Partido",
        saveButton: "Guardar",
        simulateButton: "Simular",
        ifTied: "Si hay empate (solo fase final):",

        // Alertas
        resolvePlayoffsFirst: "Primero debes resolver las repescas.",
        finishGroupsFirst: "Primero debes terminar todos los partidos de grupos.",
        penaltiesCantTie: "Los penaltis no pueden ser iguales. Define un ganador.",
        confirmReset: "¿Reiniciar todo el torneo?",
        confirmSimulateFull: "Esto simulará TODO el torneo completo automáticamente. ¿Continuar?",
        groupsCompleteTitle: "¡Fase de grupos completada!",
        groupsCompleteMsg: "¿Quieres ir a la Fase Final ahora?",
        semifinalsNotReady: "Las semifinales aún no están listas.",
        completeBothSemifinals: "Debes completar AMBAS semifinales para continuar.",
        knockoutStageComplete: "¡Fase final completada! ¿Quieres ir a las FINALES ahora?",
        semifinalsComplete: "¡Semifinales completadas! ¿Quieres ir a las FINALES ahora?",

        // Ajustes
        settings: "Ajustes",
        language: "Idioma",
        selectLanguage: "Seleccionar idioma",
        backButton: "Volver",
        spanish: "Español",
        english: "Inglés",
        french: "Francés",
        portuguese: "Portugués",
        german: "Alemán",
        arabic: "Árabe"
    },

    en: {
        // Start Screen
        welcome: "Welcome to the",
        worldCup: "World Cup 2026",
        startButton: "Start",
        settingsButton: "Settings",

        // Navigation
        navPlayoffs: "Playoffs",
        navGroups: "Groups",
        navKnockout: "Knockout",
        navFinals: "Finals",
        navResults: "Results",

        // Playoffs
        playoffsTitle: "Qualification Playoffs",
        playoffsDesc: "Resolve the playoffs to complete the 48 qualified teams",
        simulateAll: "Simulate All",
        continueButton: "Continue to Tournament",
        simulateThis: "Simulate this playoff",
        uefaRouteA: "UEFA - Route A",
        uefaRouteB: "UEFA - Route B",
        uefaRouteC: "UEFA - Route C",
        uefaRouteD: "UEFA - Route D",
        fifaPlayoffA: "FIFA Playoff A (1 qualified)",
        fifaPlayoffB: "FIFA Playoff B (1 qualified)",

        // Groups
        simulateGroups: "Simulate Groups",
        resetTournament: "Reset",
        simulateFullTournament: "Simulate Full Tournament",
        group: "Group",
        points: "Pts",
        goalDiff: "GD",
        goalsFor: "GF",

        // Knockout
        simulateKnockout: "Simulate Knockout",
        goToFinalsButton: "Go to Finals",
        roundOf32: "Round of 32",
        roundOf16: "Round of 16",
        quarterFinals: "Quarter Finals",
        semiFinals: "Semi Finals",
        finals: "Finals",
        thirdPlace: "Third Place",
        final: "Final",
        penalties: "Penalties",

        // Results
        champion2026: "World Champion 2026",
        completeTournament: "Complete the tournament to see the champion",
        bestThirds: "Best Third-Placed Teams",
        bestThirdsDesc: "The 8 best third-placed teams advance to Round of 32",
        completeGroups: "Complete the group stage",
        runnerUp: "Runner-up",
        thirdPlaceTeam: "Third Place",
        worldChampion: "WORLD CHAMPION 2026!",
        totalMatches: "Total matches",
        totalGoals: "Total goals",
        avgGoalsPerMatch: "Average goals/match",

        // Modal
        editMatch: "Edit Match",
        saveButton: "Save",
        simulateButton: "Simulate",
        ifTied: "If tied (knockout only):",

        // Alerts
        resolvePlayoffsFirst: "You must resolve the playoffs first.",
        finishGroupsFirst: "You must finish all group matches first.",
        penaltiesCantTie: "Penalties cannot be tied. Define a winner.",
        confirmReset: "Reset the entire tournament?",
        confirmSimulateFull: "This will simulate the ENTIRE tournament automatically. Continue?",
        groupsCompleteTitle: "Group stage completed!",
        groupsCompleteMsg: "Do you want to go to the Knockout stage now?",
        semifinalsNotReady: "Semifinals are not ready yet.",
        completeBothSemifinals: "You must complete BOTH semifinals to continue.",
        knockoutStageComplete: "Knockout stage completed! Do you want to go to the FINALS now?",
        semifinalsComplete: "Semifinals completed! Do you want to go to the FINALS now?",

        // Settings
        settings: "Settings",
        language: "Language",
        selectLanguage: "Select language",
        backButton: "Back",
        spanish: "Spanish",
        english: "English",
        french: "French",
        portuguese: "Portuguese",
        german: "German",
        arabic: "Arabic"
    },

    fr: {
        welcome: "Bienvenue à la",
        worldCup: "Coupe du Monde 2026",
        startButton: "Commencer",
        settingsButton: "Paramètres",
        navPlayoffs: "Barrages",
        navGroups: "Groupes",
        navKnockout: "Phase finale",
        navFinals: "Finales",
        navResults: "Résultats",
        playoffsTitle: "Barrages de qualification",
        playoffsDesc: "Résolvez les barrages pour compléter les 48 équipes qualifiées",
        simulateAll: "Simuler tout",
        continueButton: "Continuer au tournoi",
        simulateThis: "Simuler ce barrage",
        uefaRouteA: "UEFA - Route A",
        uefaRouteB: "UEFA - Route B",
        uefaRouteC: "UEFA - Route C",
        uefaRouteD: "UEFA - Route D",
        fifaPlayoffA: "Barrage FIFA A (1 qualifié)",
        fifaPlayoffB: "Barrage FIFA B (1 qualifié)",
        simulateGroups: "Simuler les groupes",
        resetTournament: "Réinitialiser",
        simulateFullTournament: "Simuler la Coupe complète",
        group: "Groupe",
        points: "Pts",
        goalDiff: "DB",
        goalsFor: "BP",
        simulateKnockout: "Simuler la phase finale",
        goToFinalsButton: "Aller aux finales",
        roundOf32: "Seizièmes de finale",
        roundOf16: "8èmes de finale",
        quarterFinals: "Quarts de finale",
        semiFinals: "Demi-finales",
        finals: "Finales",
        thirdPlace: "Troisième place",
        final: "Finale",
        penalties: "Tirs au but",
        champion2026: "Champion du Monde 2026",
        completeTournament: "Terminez le tournoi pour voir le champion",
        bestThirds: "Meilleurs troisièmes",
        bestThirdsDesc: "Les 8 meilleurs troisièmes accèdent aux 32èmes",
        completeGroups: "Terminez la phase de groupes",
        runnerUp: "Finaliste",
        thirdPlaceTeam: "Troisième place",
        worldChampion: "CHAMPION DU MONDE 2026!",
        totalMatches: "Matchs totaux",
        totalGoals: "Buts totaux",
        avgGoalsPerMatch: "Moyenne de buts/match",
        editMatch: "Modifier le match",
        saveButton: "Enregistrer",
        simulateButton: "Simuler",
        ifTied: "En cas d'égalité (phase finale uniquement):",
        resolvePlayoffsFirst: "Vous devez d'abord résoudre les barrages.",
        finishGroupsFirst: "Vous devez d'abord terminer tous les matchs de groupes.",
        penaltiesCantTie: "Les tirs au but ne peuvent pas être à égalité. Définissez un gagnant.",
        confirmReset: "Réinitialiser tout le tournoi?",
        confirmSimulateFull: "Cela simulera TOUT le tournoi automatiquement. Continuer?",
        groupsCompleteTitle: "Phase de groupes terminée!",
        groupsCompleteMsg: "Voulez-vous aller à la phase finale maintenant?",
        semifinalsNotReady: "Les demi-finales ne sont pas encore prêtes.",
        completeBothSemifinals: "Vous devez terminer les DEUX demi-finales pour continuer.",
        knockoutStageComplete: "Phase finale terminée ! Voulez-vous aller en FINALES maintenant ?",
        semifinalsComplete: "Demi-finales terminées ! Voulez-vous aller en FINALES maintenant ?",

        settings: "Paramètres",
        language: "Langue",
        selectLanguage: "Sélectionner la langue",
        backButton: "Retour",
        spanish: "Espagnol",
        english: "Anglais",
        french: "Français",
        portuguese: "Português",
        german: "Alemán",
        arabic: "Árabe"
    },

    pt: {
        welcome: "Bem-vindo à",
        worldCup: "Copa do Mundo 2026",
        startButton: "Começar",
        settingsButton: "Configurações",
        navPlayoffs: "Repescagens",
        navGroups: "Grupos",
        navKnockout: "Mata-Mata",
        navFinals: "Finais",
        navResults: "Resultados",
        playoffsTitle: "Repescagens de Qualificação",
        playoffsDesc: "Resolva as repescagens para completar as 48 seleções classificadas",
        simulateAll: "Simular Todas",
        continueButton: "Continuar ao Torneio",
        simulateThis: "Simular esta repescagem",
        uefaRouteA: "UEFA - Rota A",
        uefaRouteB: "UEFA - Rota B",
        uefaRouteC: "UEFA - Rota C",
        uefaRouteD: "UEFA - Rota D",
        fifaPlayoffA: "Repescagem FIFA A (1 classificado)",
        fifaPlayoffB: "Repescagem FIFA B (1 classificado)",
        simulateGroups: "Simular Grupos",
        resetTournament: "Reiniciar",
        simulateFullTournament: "Simular Copa Completa",
        group: "Grupo",
        points: "Pts",
        goalDiff: "SG",
        goalsFor: "GP",
        simulateKnockout: "Simular Mata-Mata",
        goToFinalsButton: "Ir para Finais",
        roundOf32: "Oitavas de final (32)",
        roundOf16: "Oitavas de Final",
        quarterFinals: "Quartas de Final",
        semiFinals: "Semifinais",
        finals: "Finais",
        thirdPlace: "Terceiro Lugar",
        final: "Final",
        penalties: "Pênaltis",
        champion2026: "Campeão Mundial 2026",
        completeTournament: "Complete o torneio para ver o campeão",
        bestThirds: "Melhores Terceiros Colocados",
        bestThirdsDesc: "Os 8 melhores terceiros avançam às oitavas",
        completeGroups: "Complete a fase de grupos",
        runnerUp: "Vice-campeão",
        thirdPlaceTeam: "Terceiro Lugar",
        worldChampion: "CAMPEÃO DO MUNDO 2026!",
        totalMatches: "Total de partidas",
        totalGoals: "Total de gols",
        avgGoalsPerMatch: "Média de gols/partida",
        editMatch: "Editar Partida",
        saveButton: "Salvar",
        simulateButton: "Simular",
        ifTied: "Se houver empate (só mata-mata):",
        resolvePlayoffsFirst: "Você deve resolver as repescagens primeiro.",
        finishGroupsFirst: "Você deve terminar todas as partidas de grupos primeiro.",
        penaltiesCantTie: "Os pênaltis não podem empatar. Defina um vencedor.",
        confirmReset: "Reiniciar todo o torneio?",
        confirmSimulateFull: "Isso simulará TODO o torneio automaticamente. Continuar?",
        groupsCompleteTitle: "Fase de grupos concluída!",
        groupsCompleteMsg: "Deseja ir para o Mata-Mata agora?",
        semifinalsNotReady: "As semifinais ainda não estão prontas.",
        completeBothSemifinals: "Você deve completar AMBAS as semifinais para continuar.",
        knockoutStageComplete: "Fase final concluída! Você quer ir para as FINAIS agora?",
        semifinalsComplete: "Semifinais concluídas! Você quer ir para as FINAIS agora?",

        settings: "Configurações",
        language: "Idioma",
        selectLanguage: "Selecionar idioma",
        backButton: "Voltar",
        spanish: "Espanhol",
        english: "Inglês",
        french: "Francês",
        portuguese: "Português",
        german: "Alemão",
        arabic: "Árabe"
    }
};

// Sistema de traducción
let currentLanguage = localStorage.getItem('worldcup2026_language') || 'es';

function t(key) {
    return translations[currentLanguage][key] || translations['es'][key] || key;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('worldcup2026_language', lang);
        updateAllTranslations();
    }
}

function updateAllTranslations() {
    // Actualizar todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translatedText = t(key);

        if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
            if (el.tagName === 'BUTTON') {
                // Preserve icons/emojis if they exist
                const match = el.innerHTML.match(/^([^a-zA-Z]+)\s*/);
                if (match) {
                    el.innerHTML = match[1] + ' ' + translatedText;
                } else {
                    el.textContent = translatedText;
                }
            }
            el.value = translatedText;
        } else {
            el.textContent = translatedText;
        }
    });

    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Re-renderizar contenido dinámico si está visible
    if (typeof renderPlayoffs === 'function') {
        // Check if playoffs section is active
        const playoffsSection = document.getElementById('playoffs');
        if (playoffsSection && playoffsSection.classList.contains('active-section')) {
            renderPlayoffs();
        }
    }

    if (typeof renderGroups === 'function' && typeof playoffsResolved !== 'undefined' && playoffsResolved === true) {
        // Check if groups section is active
        const groupsSection = document.getElementById('groups');
        if (groupsSection && groupsSection.classList.contains('active-section')) {
            renderGroups();
        }
    }
}
