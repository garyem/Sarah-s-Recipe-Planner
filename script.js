/**
 * Sarah's Recipe Planner - Interactive Weekly Meal & Recipe Planner
 * Zero-dependency Vanilla JavaScript (UK English & Metric Units)
 * Enhanced with Native Touch Drag-and-Drop for Android & iPad
 */

(function () {
  'use strict';

  // --- Constants & Pre-loaded Sample Recipes ---
  const STORAGE_KEY = 'sarahs_recipe_planner_v1';

  const DEFAULT_RECIPES = [
    {
      id: 'recipe-porridge',
      title: 'Creamy Porridge with Berries & Honey',
      category: 'Breakfast',
      prepTime: 10,
      isCustom: false,
      notes: 'Gently simmer rolled oats with milk until rich and creamy. Top with fresh berries and a drizzle of honey.',
      ingredients: [
        { name: 'Rolled oats', quantity: 80, unit: 'g' },
        { name: 'Semi-skimmed milk', quantity: 300, unit: 'ml' },
        { name: 'Mixed fresh berries', quantity: 100, unit: 'g' },
        { name: 'Honey', quantity: 1, unit: 'tbsp' },
        { name: 'Chia seeds', quantity: 1, unit: 'tsp' }
      ]
    },
    {
      id: 'recipe-poached-eggs',
      title: 'Classic Poached Eggs on Toast',
      category: 'Breakfast',
      prepTime: 15,
      isCustom: false,
      notes: 'Poach free-range eggs in lightly simmering water. Serve on warm buttered sourdough toast with pan-roasted tomatoes.',
      ingredients: [
        { name: 'Free-range eggs', quantity: 2, unit: 'whole' },
        { name: 'Sourdough bread', quantity: 2, unit: 'slices' },
        { name: 'Butter', quantity: 10, unit: 'g' },
        { name: 'Cherry tomatoes', quantity: 150, unit: 'g' },
        { name: 'Chestnut mushrooms', quantity: 100, unit: 'g' }
      ]
    },
    {
      id: 'recipe-quinoa-salad',
      title: 'Mediterranean Quinoa Salad with Feta',
      category: 'Lunch',
      prepTime: 20,
      isCustom: false,
      notes: 'Toss fluffy cooked quinoa with crunchy cucumber, crumbly feta, olives, and an extra-virgin olive oil lemon dressing.',
      ingredients: [
        { name: 'Cooked quinoa', quantity: 180, unit: 'g' },
        { name: 'Feta cheese', quantity: 75, unit: 'g' },
        { name: 'Cucumber', quantity: 100, unit: 'g' },
        { name: 'Kalamata olives', quantity: 40, unit: 'g' },
        { name: 'Extra virgin olive oil', quantity: 2, unit: 'tbsp' },
        { name: 'Lemon juice', quantity: 1, unit: 'tbsp' }
      ]
    },
    {
      id: 'recipe-salmon-wrap',
      title: 'Smoked Salmon & Avocado Wrap',
      category: 'Lunch',
      prepTime: 10,
      isCustom: false,
      notes: 'Spread Greek yoghurt and fresh dill over wholemeal tortilla wraps, layer with smoked salmon and sliced ripe avocado.',
      ingredients: [
        { name: 'Wholemeal tortilla wraps', quantity: 2, unit: 'whole' },
        { name: 'Smoked salmon', quantity: 120, unit: 'g' },
        { name: 'Ripe avocado', quantity: 1, unit: 'whole' },
        { name: 'Greek yoghurt', quantity: 45, unit: 'g' },
        { name: 'Fresh dill', quantity: 1, unit: 'tbsp' },
        { name: 'Lemon juice', quantity: 1, unit: 'tsp' }
      ]
    },
    {
      id: 'recipe-cottage-pie',
      title: 'Hearty British Cottage Pie',
      category: 'Dinner',
      prepTime: 45,
      isCustom: false,
      notes: 'Brown lean minced beef with diced carrots, onions, and beef stock. Top with buttery Maris Piper mash and bake until golden.',
      ingredients: [
        { name: 'Lean minced beef', quantity: 500, unit: 'g' },
        { name: 'Maris Piper potatoes', quantity: 600, unit: 'g' },
        { name: 'Brown onion', quantity: 1, unit: 'whole' },
        { name: 'Carrots', quantity: 150, unit: 'g' },
        { name: 'Frozen garden peas', quantity: 100, unit: 'g' },
        { name: 'Beef stock', quantity: 250, unit: 'ml' },
        { name: 'Worcestershire sauce', quantity: 1, unit: 'tbsp' },
        { name: 'Butter', quantity: 25, unit: 'g' }
      ]
    },
    {
      id: 'recipe-tikka-masala',
      title: 'Fragrant Chicken Tikka Masala',
      category: 'Dinner',
      prepTime: 35,
      isCustom: false,
      notes: 'Tender spiced chicken pieces simmered in a rich tomato and cream sauce, served alongside steamed aromatic basmati rice.',
      ingredients: [
        { name: 'Diced chicken breast', quantity: 450, unit: 'g' },
        { name: 'Basmati rice', quantity: 200, unit: 'g' },
        { name: 'Chopped tomatoes', quantity: 400, unit: 'g' },
        { name: 'Double cream', quantity: 75, unit: 'ml' },
        { name: 'Tikka curry paste', quantity: 2, unit: 'tbsp' },
        { name: 'Garlic cloves', quantity: 3, unit: 'whole' },
        { name: 'Fresh coriander', quantity: 15, unit: 'g' }
      ]
    }
  ];

  const DAYS_OF_WEEK = [
    { id: 'mon', name: 'Monday' },
    { id: 'tue', name: 'Tuesday' },
    { id: 'wed', name: 'Wednesday' },
    { id: 'thu', name: 'Thursday' },
    { id: 'fri', name: 'Friday' },
    { id: 'sat', name: 'Saturday' },
    { id: 'sun', name: 'Sunday' }
  ];

  const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast', badgeClass: 'badge-breakfast' },
    { id: 'lunch', label: 'Lunch', badgeClass: 'badge-lunch' },
    { id: 'dinner', label: 'Dinner', badgeClass: 'badge-dinner' }
  ];

  const UNIT_OPTIONS = [
    { value: 'g', label: 'g (grams)' },
    { value: 'kg', label: 'kg (kilograms)' },
    { value: 'ml', label: 'ml (millilitres)' },
    { value: 'l', label: 'l (litres)' },
    { value: 'tbsp', label: 'tbsp (tablespoons)' },
    { value: 'tsp', label: 'tsp (teaspoons)' },
    { value: 'whole', label: 'whole' },
    { value: 'slices', label: 'slices' },
    { value: 'cloves', label: 'cloves' },
    { value: 'pinch', label: 'pinch' }
  ];

  // --- Application State ---
  let state = {
    recipes: [],
    // Key: `${dayId}-${mealId}`, Value: recipeId or null
    calendar: {},
    // Array of string keys for checked items: `${name}:::${unit}`
    checkedShoppingItems: []
  };

  // UI state
  let currentCategoryFilter = 'all';
  let currentSearchQuery = '';
  let pendingSlotTarget = null;
  let pendingConfirmAction = null;
  let currentlySelectedRecipeForAssign = null;
  let currentMobileDayFilter = 'all';

  // --- Touch Drag and Drop State (for Android & iPad) ---
  let touchDragData = null; // { type: 'recipe-sidebar' | 'calendar-slot', recipeId, sourceSlotKey, recipeTitle }
  let touchGhostEl = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchDragging = false;
  let touchCandidateSlot = null;
  let touchDragSuppressClickUntil = 0;

  // --- DOM References ---
  const recipeSidebar = document.getElementById('recipeSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const btnToggleSidebarDesktop = document.getElementById('btnToggleSidebarDesktop');
  const btnToggleMobileSidebar = document.getElementById('btnToggleMobileSidebar');
  const btnCloseMobileSidebar = document.getElementById('btnCloseMobileSidebar');
  const recipeListContainer = document.getElementById('recipeListContainer');
  const recipeCountBadge = document.getElementById('recipeCountBadge');
  const recipeSearchInput = document.getElementById('recipeSearchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const catPills = document.querySelectorAll('.cat-pill');
  const btnOpenAddRecipeModal = document.getElementById('btnOpenAddRecipeModal');

  const calendarMain = document.getElementById('calendarMain');
  const weeklyGrid = document.getElementById('weeklyGrid');
  const scheduledStatsBadge = document.getElementById('scheduledStatsBadge');
  const btnClearWeek = document.getElementById('btnClearWeek');
  const dayTabButtons = document.querySelectorAll('.day-tab-btn');

  const btnOpenShoppingList = document.getElementById('btnOpenShoppingList');
  const shoppingItemCountBadge = document.getElementById('shoppingItemCountBadge');
  const shoppingListModal = document.getElementById('shoppingListModal');
  const shoppingItemsList = document.getElementById('shoppingItemsList');
  const shoppingEmptyState = document.getElementById('shoppingEmptyState');
  const shoppingProgressText = document.getElementById('shoppingProgressText');
  const shoppingProgressBar = document.getElementById('shoppingProgressBar');
  const btnCopyShoppingList = document.getElementById('btnCopyShoppingList');
  const btnUncheckAllShopping = document.getElementById('btnUncheckAllShopping');

  const btnExportBackup = document.getElementById('btnExportBackup');
  const importBackupInput = document.getElementById('importBackupInput');

  // Bottom Navigation DOM (Android / iPad)
  const navBtnCalendar = document.getElementById('navBtnCalendar');
  const navBtnRecipes = document.getElementById('navBtnRecipes');
  const navBtnAddRecipe = document.getElementById('navBtnAddRecipe');
  const navBtnShopping = document.getElementById('navBtnShopping');
  const navShoppingBadge = document.getElementById('navShoppingBadge');

  // Modals
  const recipeModal = document.getElementById('recipeModal');
  const recipeForm = document.getElementById('recipeForm');
  const ingredientRowsContainer = document.getElementById('ingredientRowsContainer');
  const btnAddIngredientRow = document.getElementById('btnAddIngredientRow');

  const recipeDetailModal = document.getElementById('recipeDetailModal');
  const recipeDetailTitle = document.getElementById('recipeDetailTitle');
  const recipeDetailCategory = document.getElementById('recipeDetailCategory');
  const recipeDetailTime = document.getElementById('recipeDetailTime');
  const recipeDetailIngredientList = document.getElementById('recipeDetailIngredientList');
  const recipeDetailNotesBlock = document.getElementById('recipeDetailNotesBlock');
  const recipeDetailNotesText = document.getElementById('recipeDetailNotesText');
  const btnAssignFromDetail = document.getElementById('btnAssignFromDetail');

  const slotPickerModal = document.getElementById('slotPickerModal');
  const slotPickerSubtitle = document.getElementById('slotPickerSubtitle');
  const pickerSearchInput = document.getElementById('pickerSearchInput');
  const pickerRecipeList = document.getElementById('pickerRecipeList');

  const quickAssignModal = document.getElementById('quickAssignModal');
  const quickAssignRecipeName = document.getElementById('quickAssignRecipeName');
  const quickAssignForm = document.getElementById('quickAssignForm');
  const quickAssignDaySelect = document.getElementById('quickAssignDaySelect');
  const quickAssignMealSelect = document.getElementById('quickAssignMealSelect');

  const confirmModal = document.getElementById('confirmModal');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmMessage = document.getElementById('confirmMessage');
  const btnCancelConfirm = document.getElementById('btnCancelConfirm');
  const btnProceedConfirm = document.getElementById('btnProceedConfirm');

  const toastContainer = document.getElementById('toastContainer');

  // --- Initialisation ---
  function init() {
    loadStateFromStorage();
    setupEventListeners();
    setupTouchDragAndDropEngine();
    renderAll();
  }

  // --- Local Storage Management ---
  function loadStateFromStorage() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('freshplate_meal_planner_v1');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed.recipes) && parsed.recipes.length > 0) {
          state.recipes = parsed.recipes;
        } else {
          state.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
        }
        state.calendar = parsed.calendar || {};
        state.checkedShoppingItems = Array.isArray(parsed.checkedShoppingItems) ? parsed.checkedShoppingItems : [];
      } else {
        // Initial setup with defaults
        state.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
        state.calendar = {
          'mon-breakfast': 'recipe-porridge',
          'mon-lunch': 'recipe-quinoa-salad',
          'mon-dinner': 'recipe-cottage-pie',
          'wed-dinner': 'recipe-tikka-masala',
          'fri-lunch': 'recipe-salmon-wrap',
          'sat-breakfast': 'recipe-poached-eggs'
        };
        state.checkedShoppingItems = [];
        saveStateToStorage();
      }
    } catch (e) {
      console.error('Error loading stored plan:', e);
      state.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
      state.calendar = {};
      state.checkedShoppingItems = [];
    }
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
      showToast('Could not save to local storage: storage quota exceeded.', 'error');
    }
  }

  // --- Rendering Functions ---
  function renderAll() {
    renderRecipeSidebar();
    renderWeeklyCalendar();
    updateHeaderStats();
  }

  function updateHeaderStats() {
    // Scheduled meals count
    let count = 0;
    DAYS_OF_WEEK.forEach(day => {
      MEAL_TYPES.forEach(meal => {
        const slotKey = `${day.id}-${meal.id}`;
        if (state.calendar[slotKey]) count++;
      });
    });
    scheduledStatsBadge.textContent = `${count} / 21 meals scheduled`;

    // Shopping badge count
    const shoppingList = generateConsolidatedShoppingList();
    const countText = shoppingList.length.toString();
    if (shoppingList.length > 0) {
      shoppingItemCountBadge.textContent = countText;
      shoppingItemCountBadge.style.display = 'inline-block';
      if (navShoppingBadge) {
        navShoppingBadge.textContent = countText;
        navShoppingBadge.style.display = 'block';
      }
    } else {
      shoppingItemCountBadge.style.display = 'none';
      if (navShoppingBadge) {
        navShoppingBadge.style.display = 'none';
      }
    }
  }

  // Render Sidebar Recipe Cards
  function renderRecipeSidebar() {
    recipeListContainer.innerHTML = '';

    const filtered = state.recipes.filter(recipe => {
      const matchesCategory = currentCategoryFilter === 'all' || 
        recipe.category.toLowerCase() === currentCategoryFilter.toLowerCase() ||
        recipe.category.toLowerCase() === 'any';

      if (!matchesCategory) return false;

      if (!currentSearchQuery.trim()) return true;

      const q = currentSearchQuery.toLowerCase();
      const inTitle = recipe.title.toLowerCase().includes(q);
      const inIngredients = recipe.ingredients.some(ing => ing.name.toLowerCase().includes(q));
      return inTitle || inIngredients;
    });

    recipeCountBadge.textContent = `${state.recipes.length} recipe${state.recipes.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'sidebar-empty-search';
      emptyDiv.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>No recipes match your search.</p>
      `;
      recipeListContainer.appendChild(emptyDiv);
      return;
    }

    filtered.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.setAttribute('draggable', 'true');
      card.dataset.recipeId = recipe.id;

      const categoryBadgeClass = getCategoryBadgeClass(recipe.category);

      card.innerHTML = `
        <div class="recipe-card-header">
          <h3 class="recipe-card-title">${escapeHtml(recipe.title)}</h3>
          <div class="recipe-card-actions">
            <button type="button" class="btn-card-action btn-card-info" title="View recipe details" aria-label="View recipe details">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
            ${recipe.isCustom ? `
              <button type="button" class="btn-card-action btn-card-delete" title="Delete custom recipe" aria-label="Delete recipe">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>

        <div class="recipe-card-meta">
          <span class="badge-tag ${categoryBadgeClass}">${escapeHtml(recipe.category)}</span>
          <span class="recipe-time-tag">⏱️ ${recipe.prepTime} mins</span>
          <span class="recipe-ing-count">• ${recipe.ingredients.length} items</span>
        </div>

        <div class="recipe-card-footer">
          <div class="drag-grip-indicator" title="Drag onto weekly calendar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="5" r="1"></circle>
              <circle cx="9" cy="12" r="1"></circle>
              <circle cx="9" cy="19" r="1"></circle>
              <circle cx="15" cy="5" r="1"></circle>
              <circle cx="15" cy="12" r="1"></circle>
              <circle cx="15" cy="19" r="1"></circle>
            </svg>
            <span>Touch or Drag</span>
          </div>
          <button type="button" class="btn-quick-schedule" title="Assign to slot without dragging">
            Schedule +
          </button>
        </div>
      `;

      // HTML5 Drag and Drop event listeners on the recipe card (Desktop)
      card.addEventListener('dragstart', handleRecipeDragStart);
      card.addEventListener('dragend', handleRecipeDragEnd);

      // Touch Drag Initiation on recipe card (Android & iPad)
      card.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchDragData = {
          type: 'recipe-sidebar',
          recipeId: recipe.id,
          recipeTitle: recipe.title
        };
        isTouchDragging = false;
      }, { passive: true });

      // Card action buttons
      const btnInfo = card.querySelector('.btn-card-info');
      btnInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        openRecipeDetailModal(recipe.id);
      });

      const btnDelete = card.querySelector('.btn-card-delete');
      if (btnDelete) {
        btnDelete.addEventListener('click', (e) => {
          e.stopPropagation();
          confirmDeleteRecipe(recipe.id, recipe.title);
        });
      }

      const btnQuick = card.querySelector('.btn-quick-schedule');
      btnQuick.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickAssignModal(recipe.id);
      });

      // Clicking the card body opens details (unless recently dragged)
      card.addEventListener('click', () => {
        if (Date.now() < touchDragSuppressClickUntil) return;
        openRecipeDetailModal(recipe.id);
      });

      recipeListContainer.appendChild(card);
    });
  }

  // Render Weekly Calendar (7 Days x 3 Slots)
  function renderWeeklyCalendar() {
    weeklyGrid.innerHTML = '';

    DAYS_OF_WEEK.forEach(day => {
      const dayCol = document.createElement('div');
      dayCol.className = 'day-column';
      dayCol.dataset.day = day.id;

      // Filter check for mobile & tablet tabs
      if (currentMobileDayFilter !== 'all' && currentMobileDayFilter !== day.id) {
        dayCol.style.display = 'none';
      } else {
        dayCol.style.display = '';
      }

      // Day column header with scheduled count
      let dayMealCount = 0;
      MEAL_TYPES.forEach(meal => {
        if (state.calendar[`${day.id}-${meal.id}`]) dayMealCount++;
      });

      dayCol.innerHTML = `
        <div class="day-column-header">
          <div class="day-title-wrap">
            <span class="day-name">${day.name}</span>
            <span class="day-meal-count">${dayMealCount} of 3 meals planned</span>
          </div>
        </div>
        <div class="day-slots-container"></div>
      `;

      const slotsContainer = dayCol.querySelector('.day-slots-container');

      MEAL_TYPES.forEach(meal => {
        const slotKey = `${day.id}-${meal.id}`;
        const scheduledRecipeId = state.calendar[slotKey];
        const scheduledRecipe = scheduledRecipeId ? findRecipeById(scheduledRecipeId) : null;

        const slotWrapper = document.createElement('div');
        slotWrapper.className = 'meal-slot-wrapper';

        const labelClass = `label-${meal.id}`;
        slotWrapper.innerHTML = `
          <div class="meal-slot-label ${labelClass}">
            <span>${meal.label}</span>
          </div>
        `;

        const slotEl = document.createElement('div');
        slotEl.className = 'meal-slot';
        slotEl.dataset.slotKey = slotKey;
        slotEl.dataset.dayId = day.id;
        slotEl.dataset.mealId = meal.id;

        // HTML5 Drag and Drop listeners on the slot
        slotEl.addEventListener('dragover', handleSlotDragOver);
        slotEl.addEventListener('dragleave', handleSlotDragLeave);
        slotEl.addEventListener('drop', handleSlotDrop);

        if (scheduledRecipe) {
          slotEl.classList.add('is-filled');
          slotEl.setAttribute('draggable', 'true');
          slotEl.dataset.recipeId = scheduledRecipe.id;

          // Desktop HTML5 drag
          slotEl.addEventListener('dragstart', handleSlotMealDragStart);
          slotEl.addEventListener('dragend', handleSlotMealDragEnd);

          // Touch Drag Initiation on filled slot (Android & iPad)
          slotEl.addEventListener('touchstart', (e) => {
            if (e.target.closest('button')) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchDragData = {
              type: 'calendar-slot',
              sourceSlotKey: slotKey,
              recipeId: scheduledRecipe.id,
              recipeTitle: scheduledRecipe.title
            };
            isTouchDragging = false;
          }, { passive: true });

          slotEl.innerHTML = `
            <div class="slot-filled-content">
              <span class="slot-recipe-title">${escapeHtml(scheduledRecipe.title)}</span>
              <div class="slot-meta-row">
                <span>⏱️ ${scheduledRecipe.prepTime}m</span>
                <span>• ${scheduledRecipe.ingredients.length} ing.</span>
              </div>
            </div>
            <div class="slot-actions">
              <button type="button" class="btn-slot-info" title="View ingredients" aria-label="View recipe details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
              <button type="button" class="btn-slot-remove" title="Remove meal from slot" aria-label="Remove meal">
                &times;
              </button>
            </div>
          `;

          // Info button
          const btnInfo = slotEl.querySelector('.btn-slot-info');
          btnInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            openRecipeDetailModal(scheduledRecipe.id);
          });

          // Remove button
          const btnRemove = slotEl.querySelector('.btn-slot-remove');
          btnRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            removeMealFromSlot(slotKey);
          });

          // Tap to view or change
          slotEl.addEventListener('click', (e) => {
            if (Date.now() < touchDragSuppressClickUntil) return;
            if (e.target.closest('button')) return;
            openRecipeDetailModal(scheduledRecipe.id);
          });

        } else {
          slotEl.classList.add('is-empty');
          slotEl.innerHTML = `
            <div class="slot-empty-prompt">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Tap / Drop</span>
            </div>
          `;

          // Tap on empty slot opens slot picker for touch / mobile friendly assignment
          slotEl.addEventListener('click', () => {
            if (Date.now() < touchDragSuppressClickUntil) return;
            openSlotPickerModal(slotKey, day.name, meal.label);
          });
        }

        slotWrapper.appendChild(slotEl);
        slotsContainer.appendChild(slotWrapper);
      });

      weeklyGrid.appendChild(dayCol);
    });
  }

  // --- HTML5 Desktop Drag and Drop Handlers ---
  function handleRecipeDragStart(e) {
    const card = e.currentTarget;
    const recipeId = card.dataset.recipeId;
    card.classList.add('is-dragging');

    const dragPayload = {
      type: 'recipe-sidebar',
      recipeId: recipeId
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(dragPayload));
    e.dataTransfer.effectAllowed = 'copyMove';
  }

  function handleRecipeDragEnd(e) {
    e.currentTarget.classList.remove('is-dragging');
    document.querySelectorAll('.meal-slot').forEach(slot => {
      slot.classList.remove('drag-over');
    });
  }

  function handleSlotMealDragStart(e) {
    const slotEl = e.currentTarget;
    slotEl.classList.add('is-dragging');

    const dragPayload = {
      type: 'calendar-slot',
      sourceSlotKey: slotEl.dataset.slotKey,
      recipeId: slotEl.dataset.recipeId
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(dragPayload));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleSlotMealDragEnd(e) {
    e.currentTarget.classList.remove('is-dragging');
    document.querySelectorAll('.meal-slot').forEach(slot => {
      slot.classList.remove('drag-over');
    });
  }

  function handleSlotDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
  }

  function handleSlotDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  function handleSlotDrop(e) {
    e.preventDefault();
    const targetSlot = e.currentTarget;
    targetSlot.classList.remove('drag-over');
    const targetSlotKey = targetSlot.dataset.slotKey;

    try {
      const rawData = e.dataTransfer.getData('text/plain');
      if (!rawData) return;
      const data = JSON.parse(rawData);

      if (data.type === 'recipe-sidebar') {
        // Dragged from sidebar
        assignRecipeToSlot(targetSlotKey, data.recipeId);
        const recipe = findRecipeById(data.recipeId);
        if (recipe) {
          showToast(`Scheduled "${recipe.title}" for ${formatSlotName(targetSlotKey)}`);
        }
      } else if (data.type === 'calendar-slot') {
        // Dragged from another slot (move or swap)
        const sourceSlotKey = data.sourceSlotKey;
        if (sourceSlotKey === targetSlotKey) return;

        const previousTargetRecipeId = state.calendar[targetSlotKey] || null;
        state.calendar[targetSlotKey] = data.recipeId;
        state.calendar[sourceSlotKey] = previousTargetRecipeId;

        saveStateToStorage();
        renderWeeklyCalendar();
        updateHeaderStats();
        showToast(`Moved meal to ${formatSlotName(targetSlotKey)}`);
      }
    } catch (err) {
      console.error('Error handling drop:', err);
    }
  }

  // --- Native Touch Drag & Drop Engine (Android & iPad) ---
  function setupTouchDragAndDropEngine() {
    window.addEventListener('touchmove', (e) => {
      if (!touchDragData) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const distance = Math.hypot(dx, dy);

      // Start dragging after exceeding 10px threshold
      if (!isTouchDragging && distance > 10) {
        isTouchDragging = true;
        if ('vibrate' in navigator) {
          try { navigator.vibrate(25); } catch (_) {}
        }

        // Close sidebar if dragging from mobile drawer to calendar
        if (recipeSidebar.classList.contains('is-open')) {
          recipeSidebar.classList.remove('is-open');
          sidebarBackdrop.classList.remove('is-open');
        }

        // Create floating ghost element
        touchGhostEl = document.createElement('div');
        touchGhostEl.className = 'touch-drag-ghost';
        touchGhostEl.innerHTML = `
          <span class="ghost-title">${escapeHtml(touchDragData.recipeTitle)}</span>
          <span class="ghost-subtitle">Drop into calendar slot</span>
        `;
        document.body.appendChild(touchGhostEl);
      }

      if (isTouchDragging && touchGhostEl) {
        if (e.cancelable) e.preventDefault(); // Prevent accidental scroll during drag
        touchGhostEl.style.left = `${touch.clientX}px`;
        touchGhostEl.style.top = `${touch.clientY}px`;

        // Temporarily hide ghost to inspect underlying slot
        touchGhostEl.style.display = 'none';
        const elemUnder = document.elementFromPoint(touch.clientX, touch.clientY);
        touchGhostEl.style.display = 'flex';

        const slot = elemUnder ? elemUnder.closest('.meal-slot') : null;
        if (slot !== touchCandidateSlot) {
          if (touchCandidateSlot) touchCandidateSlot.classList.remove('drag-over');
          touchCandidateSlot = slot;
          if (touchCandidateSlot) touchCandidateSlot.classList.add('drag-over');
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!touchDragData) return;

      if (isTouchDragging) {
        touchDragSuppressClickUntil = Date.now() + 350;

        if (touchCandidateSlot) {
          const targetSlotKey = touchCandidateSlot.dataset.slotKey;

          if (touchDragData.type === 'recipe-sidebar') {
            assignRecipeToSlot(targetSlotKey, touchDragData.recipeId);
            showToast(`Scheduled "${touchDragData.recipeTitle}" for ${formatSlotName(targetSlotKey)}`);
          } else if (touchDragData.type === 'calendar-slot') {
            const sourceSlotKey = touchDragData.sourceSlotKey;
            if (sourceSlotKey !== targetSlotKey) {
              const previousTargetRecipeId = state.calendar[targetSlotKey] || null;
              state.calendar[targetSlotKey] = touchDragData.recipeId;
              state.calendar[sourceSlotKey] = previousTargetRecipeId;
              saveStateToStorage();
              renderWeeklyCalendar();
              updateHeaderStats();
              showToast(`Moved meal to ${formatSlotName(targetSlotKey)}`);
            }
          }

          if ('vibrate' in navigator) {
            try { navigator.vibrate([20, 30, 20]); } catch (_) {}
          }
        }
      }

      cleanupTouchDrag();
    });

    window.addEventListener('touchcancel', cleanupTouchDrag);
  }

  function cleanupTouchDrag() {
    if (touchGhostEl) {
      touchGhostEl.remove();
      touchGhostEl = null;
    }
    if (touchCandidateSlot) {
      touchCandidateSlot.classList.remove('drag-over');
      touchCandidateSlot = null;
    }
    isTouchDragging = false;
    touchDragData = null;
  }

  // --- Calendar Slot Logic ---
  function assignRecipeToSlot(slotKey, recipeId) {
    state.calendar[slotKey] = recipeId;
    saveStateToStorage();
    renderWeeklyCalendar();
    updateHeaderStats();
  }

  function removeMealFromSlot(slotKey) {
    if (state.calendar[slotKey]) {
      delete state.calendar[slotKey];
      saveStateToStorage();
      renderWeeklyCalendar();
      updateHeaderStats();
      showToast('Meal removed from schedule');
    }
  }

  function clearEntireWeek() {
    state.calendar = {};
    saveStateToStorage();
    renderWeeklyCalendar();
    updateHeaderStats();
    showToast('Weekly calendar has been cleared');
  }

  // --- Combined Shopping List Consolidation ---
  function generateConsolidatedShoppingList() {
    // 1. Gather all recipe IDs currently on the calendar
    const activeRecipeIds = Object.values(state.calendar).filter(Boolean);
    if (activeRecipeIds.length === 0) return [];

    // 2. Aggregate ingredients by normalized (name + unit)
    const aggregatedMap = new Map();

    activeRecipeIds.forEach(recipeId => {
      const recipe = findRecipeById(recipeId);
      if (!recipe || !Array.isArray(recipe.ingredients)) return;

      recipe.ingredients.forEach(ing => {
        if (!ing.name || !ing.quantity) return;

        const normalizedName = ing.name.trim().toLowerCase();
        const normalizedUnit = (ing.unit || '').trim().toLowerCase();
        const mapKey = `${normalizedName}:::${normalizedUnit}`;

        if (!aggregatedMap.has(mapKey)) {
          aggregatedMap.set(mapKey, {
            displayName: ing.name.trim(),
            quantity: Number(ing.quantity) || 0,
            unit: ing.unit || '',
            normalizedKey: mapKey
          });
        } else {
          const existing = aggregatedMap.get(mapKey);
          existing.quantity += Number(ing.quantity) || 0;
        }
      });
    });

    // 3. Convert map to sorted array (alphabetical by name)
    const list = Array.from(aggregatedMap.values()).sort((a, b) => 
      a.displayName.localeCompare(b.displayName)
    );

    return list;
  }

  function openShoppingListModal() {
    const items = generateConsolidatedShoppingList();
    shoppingItemsList.innerHTML = '';

    if (items.length === 0) {
      shoppingEmptyState.style.display = 'block';
      shoppingItemsList.style.display = 'none';
      shoppingProgressText.textContent = '0 items';
      shoppingProgressBar.style.width = '0%';
    } else {
      shoppingEmptyState.style.display = 'none';
      shoppingItemsList.style.display = 'flex';

      let checkedCount = 0;

      items.forEach(item => {
        const isChecked = state.checkedShoppingItems.includes(item.normalizedKey);
        if (isChecked) checkedCount++;

        const row = document.createElement('div');
        row.className = `shopping-item-row ${isChecked ? 'is-checked' : ''}`;
        row.dataset.key = item.normalizedKey;

        // Clean numeric formatting (e.g., 2.5 or 35 without excess decimals)
        const formattedQty = parseFloat(item.quantity.toFixed(2));

        row.innerHTML = `
          <label class="shopping-item-label">
            <input type="checkbox" class="shopping-checkbox" ${isChecked ? 'checked' : ''}>
            <span class="shopping-item-name">${escapeHtml(item.displayName)}</span>
          </label>
          <span class="shopping-item-qty">${formattedQty} ${escapeHtml(item.unit)}</span>
        `;

        const checkbox = row.querySelector('.shopping-checkbox');
        checkbox.addEventListener('change', () => {
          toggleShoppingItemChecked(item.normalizedKey, checkbox.checked, row);
        });

        shoppingItemsList.appendChild(row);
      });

      updateShoppingProgress(checkedCount, items.length);
    }

    openModal(shoppingListModal);
  }

  function toggleShoppingItemChecked(key, isChecked, rowEl) {
    if (isChecked) {
      if (!state.checkedShoppingItems.includes(key)) {
        state.checkedShoppingItems.push(key);
      }
      rowEl.classList.add('is-checked');
      if ('vibrate' in navigator) {
        try { navigator.vibrate(15); } catch (_) {}
      }
    } else {
      state.checkedShoppingItems = state.checkedShoppingItems.filter(k => k !== key);
      rowEl.classList.remove('is-checked');
    }

    saveStateToStorage();

    const items = generateConsolidatedShoppingList();
    const checkedCount = state.checkedShoppingItems.filter(k => 
      items.some(item => item.normalizedKey === k)
    ).length;

    updateShoppingProgress(checkedCount, items.length);
  }

  function updateShoppingProgress(checked, total) {
    shoppingProgressText.textContent = `${checked} of ${total} items checked`;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    shoppingProgressBar.style.width = `${percent}%`;
  }

  function uncheckAllShoppingItems() {
    state.checkedShoppingItems = [];
    saveStateToStorage();
    document.querySelectorAll('.shopping-checkbox').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('.shopping-item-row').forEach(row => { row.classList.remove('is-checked'); });
    const items = generateConsolidatedShoppingList();
    updateShoppingProgress(0, items.length);
    showToast('Unchecked all shopping items');
  }

  function copyShoppingListToClipboard() {
    const items = generateConsolidatedShoppingList();
    if (items.length === 0) {
      showToast('No items on the shopping list to copy', 'error');
      return;
    }

    let mealCount = 0;
    Object.values(state.calendar).forEach(r => { if (r) mealCount++; });

    const lines = [
      `🛒 Sarah's Recipe Planner - Weekly Shopping List (${items.length} items)`,
      `Scheduled Meals: ${mealCount}`,
      `Date: ${new Date().toLocaleDateString('en-GB')}`,
      '----------------------------------------'
    ];

    items.forEach(item => {
      const isChecked = state.checkedShoppingItems.includes(item.normalizedKey);
      const mark = isChecked ? '[✓]' : '[ ]';
      const formattedQty = parseFloat(item.quantity.toFixed(2));
      lines.push(`${mark} ${item.displayName}: ${formattedQty} ${item.unit}`);
    });

    const fullText = lines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        showToast('Shopping list copied to clipboard!');
      }).catch(err => {
        fallbackCopyText(fullText);
      });
    } else {
      fallbackCopyText(fullText);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Shopping list copied to clipboard!');
    } catch (e) {
      showToast('Could not copy automatically. Please select text manually.', 'error');
    }
    document.body.removeChild(textArea);
  }

  // --- Add / Edit Recipe Modal & Dynamic Ingredient Rows ---
  function openAddRecipeModal() {
    recipeForm.reset();
    ingredientRowsContainer.innerHTML = '';

    // Pre-populate with 3 empty ingredient rows
    addIngredientInputRow('', '', 'g');
    addIngredientInputRow('', '', 'ml');
    addIngredientInputRow('', '', 'whole');

    openModal(recipeModal);
  }

  function addIngredientInputRow(defaultName = '', defaultQty = '', defaultUnit = 'g') {
    const row = document.createElement('div');
    row.className = 'ingredient-row';

    let unitOptionsHtml = '';
    UNIT_OPTIONS.forEach(opt => {
      const selected = opt.value === defaultUnit ? 'selected' : '';
      unitOptionsHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
    });

    row.innerHTML = `
      <input type="text" class="ing-name-input" placeholder="e.g. Rolled oats or Minced beef" value="${escapeHtml(defaultName)}" required>
      <input type="number" step="any" min="0.1" class="ing-qty-input" placeholder="Qty" value="${defaultQty}" required>
      <select class="ing-unit-select" required>
        ${unitOptionsHtml}
      </select>
      <button type="button" class="btn-remove-ing-row" title="Remove ingredient">&times;</button>
    `;

    const btnRemove = row.querySelector('.btn-remove-ing-row');
    btnRemove.addEventListener('click', () => {
      if (ingredientRowsContainer.children.length > 1) {
        row.remove();
      } else {
        showToast('A recipe requires at least one ingredient', 'error');
      }
    });

    ingredientRowsContainer.appendChild(row);
  }

  function handleRecipeFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('recipeTitleInput').value.trim();
    const category = document.getElementById('recipeCategorySelect').value;
    const prepTime = parseInt(document.getElementById('recipePrepTimeInput').value, 10);
    const notes = document.getElementById('recipeNotesInput').value.trim();

    if (!title) {
      showToast('Please enter a recipe name', 'error');
      return;
    }

    if (!prepTime || prepTime < 1) {
      showToast('Please specify a valid prep time in minutes', 'error');
      return;
    }

    const rows = ingredientRowsContainer.querySelectorAll('.ingredient-row');
    const ingredients = [];

    rows.forEach(row => {
      const name = row.querySelector('.ing-name-input').value.trim();
      const qty = parseFloat(row.querySelector('.ing-qty-input').value);
      const unit = row.querySelector('.ing-unit-select').value;

      if (name && !isNaN(qty) && qty > 0) {
        ingredients.push({ name, quantity: qty, unit });
      }
    });

    if (ingredients.length === 0) {
      showToast('Please provide at least one valid ingredient with name and quantity', 'error');
      return;
    }

    const newRecipe = {
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: title,
      category: category,
      prepTime: prepTime,
      isCustom: true,
      notes: notes,
      ingredients: ingredients
    };

    state.recipes.unshift(newRecipe);
    saveStateToStorage();
    renderRecipeSidebar();
    updateHeaderStats();
    closeModal(recipeModal);
    showToast(`Saved new recipe "${title}"!`);
  }

  // --- Recipe Detail Viewer Modal ---
  function openRecipeDetailModal(recipeId) {
    const recipe = findRecipeById(recipeId);
    if (!recipe) return;

    currentlySelectedRecipeForAssign = recipe.id;
    recipeDetailTitle.textContent = recipe.title;

    recipeDetailCategory.className = `badge-tag ${getCategoryBadgeClass(recipe.category)}`;
    recipeDetailCategory.textContent = recipe.category;
    recipeDetailTime.textContent = `⏱️ ${recipe.prepTime} mins prep`;

    recipeDetailIngredientList.innerHTML = '';
    recipe.ingredients.forEach(ing => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="font-medium">${escapeHtml(ing.name)}</span>
        <span class="text-muted font-bold">${ing.quantity} ${escapeHtml(ing.unit)}</span>
      `;
      recipeDetailIngredientList.appendChild(li);
    });

    if (recipe.notes && recipe.notes.trim()) {
      recipeDetailNotesText.textContent = recipe.notes;
      recipeDetailNotesBlock.style.display = 'block';
    } else {
      recipeDetailNotesBlock.style.display = 'none';
    }

    openModal(recipeDetailModal);
  }

  // --- Slot Picker Modal (Tap to Assign on Mobile/Touch) ---
  function openSlotPickerModal(slotKey, dayName, mealLabel) {
    pendingSlotTarget = slotKey;
    slotPickerSubtitle.textContent = `For ${dayName} ${mealLabel}`;
    pickerSearchInput.value = '';
    renderSlotPickerList('');
    openModal(slotPickerModal);
  }

  function renderSlotPickerList(query) {
    pickerRecipeList.innerHTML = '';
    const q = query.trim().toLowerCase();

    const filtered = state.recipes.filter(r => {
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || 
             r.ingredients.some(i => i.name.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      pickerRecipeList.innerHTML = '<p class="text-muted text-center py-4">No recipes found.</p>';
      return;
    }

    filtered.forEach(recipe => {
      const item = document.createElement('div');
      item.className = 'picker-recipe-item';
      item.innerHTML = `
        <div class="picker-item-info">
          <span class="picker-item-title">${escapeHtml(recipe.title)}</span>
          <span class="picker-item-meta">${recipe.category} • ⏱️ ${recipe.prepTime}m • ${recipe.ingredients.length} items</span>
        </div>
        <span class="btn btn-primary btn-sm">Select</span>
      `;

      item.addEventListener('click', () => {
        if (pendingSlotTarget) {
          assignRecipeToSlot(pendingSlotTarget, recipe.id);
          showToast(`Scheduled "${recipe.title}" for ${formatSlotName(pendingSlotTarget)}`);
          closeModal(slotPickerModal);
          pendingSlotTarget = null;
        }
      });

      pickerRecipeList.appendChild(item);
    });
  }

  // --- Quick Assign Modal (from Sidebar Recipe Card) ---
  function openQuickAssignModal(recipeId) {
    const recipe = findRecipeById(recipeId);
    if (!recipe) return;

    currentlySelectedRecipeForAssign = recipeId;
    quickAssignRecipeName.textContent = recipe.title;

    // Set sensible default meal slot based on recipe category
    if (recipe.category.toLowerCase() === 'breakfast') {
      quickAssignMealSelect.value = 'breakfast';
    } else if (recipe.category.toLowerCase() === 'lunch') {
      quickAssignMealSelect.value = 'lunch';
    } else {
      quickAssignMealSelect.value = 'dinner';
    }

    openModal(quickAssignModal);
  }

  function handleQuickAssignSubmit(e) {
    e.preventDefault();
    if (!currentlySelectedRecipeForAssign) return;

    const day = quickAssignDaySelect.value;
    const meal = quickAssignMealSelect.value;
    const targetSlotKey = `${day}-${meal}`;

    assignRecipeToSlot(targetSlotKey, currentlySelectedRecipeForAssign);
    const recipe = findRecipeById(currentlySelectedRecipeForAssign);
    showToast(`Scheduled "${recipe.title}" for ${formatSlotName(targetSlotKey)}`);
    closeModal(quickAssignModal);
  }

  // --- Confirm Dialog Helper ---
  function showConfirmDialog(title, message, onConfirm) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    pendingConfirmAction = onConfirm;
    openModal(confirmModal);
  }

  function confirmClearWeek() {
    showConfirmDialog(
      'Clear Weekly Calendar?',
      'Are you sure you want to clear all scheduled meals for this week? This action cannot be undone.',
      () => {
        clearEntireWeek();
      }
    );
  }

  function confirmDeleteRecipe(recipeId, recipeTitle) {
    showConfirmDialog(
      'Delete Recipe?',
      `Are you sure you want to delete "${recipeTitle}"? Any meals currently scheduled with this recipe will also be removed.`,
      () => {
        // Remove recipe
        state.recipes = state.recipes.filter(r => r.id !== recipeId);
        // Clear slots with this recipe
        Object.keys(state.calendar).forEach(slotKey => {
          if (state.calendar[slotKey] === recipeId) {
            delete state.calendar[slotKey];
          }
        });
        saveStateToStorage();
        renderAll();
        showToast(`Deleted recipe "${recipeTitle}"`);
      }
    );
  }

  // --- Backup & Restore (JSON Export / Import) ---
  function exportBackup() {
    const backupData = {
      appName: "Sarah's Recipe Planner",
      version: 1,
      exportedAt: new Date().toISOString(),
      recipes: state.recipes,
      calendar: state.calendar,
      checkedShoppingItems: state.checkedShoppingItems
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarahs-recipe-planner-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Backup exported as JSON!');
  }

  function importBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const importedData = JSON.parse(event.target.result);

        if (!importedData.recipes || !Array.isArray(importedData.recipes)) {
          throw new Error('Invalid backup file: missing recipes list.');
        }

        showConfirmDialog(
          'Import Backup?',
          'Importing this backup will replace your current recipes and weekly plan. Do you wish to continue?',
          () => {
            state.recipes = importedData.recipes;
            state.calendar = importedData.calendar || {};
            state.checkedShoppingItems = Array.isArray(importedData.checkedShoppingItems) 
              ? importedData.checkedShoppingItems 
              : [];

            saveStateToStorage();
            renderAll();
            showToast('Backup imported successfully!');
          }
        );
      } catch (err) {
        console.error('Import error:', err);
        showToast('Failed to import backup: invalid JSON format.', 'error');
      } finally {
        importBackupInput.value = '';
      }
    };

    reader.readAsText(file);
  }

  // --- Modal Helpers ---
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');

    // Only restore body scroll if no other modals are open
    const openModals = document.querySelectorAll('.modal-backdrop.is-open');
    if (openModals.length === 0) {
      document.body.style.overflow = '';
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => {
        toast.remove();
      }, 200);
    }, 3000);
  }

  // --- Utility Helpers ---
  function findRecipeById(id) {
    return state.recipes.find(r => r.id === id) || null;
  }

  function getCategoryBadgeClass(category) {
    const cat = (category || '').toLowerCase();
    if (cat === 'breakfast') return 'badge-breakfast';
    if (cat === 'lunch') return 'badge-lunch';
    if (cat === 'dinner') return 'badge-dinner';
    return 'badge-any';
  }

  function formatSlotName(slotKey) {
    const [dayId, mealId] = slotKey.split('-');
    const day = DAYS_OF_WEEK.find(d => d.id === dayId);
    const meal = MEAL_TYPES.find(m => m.id === mealId);
    return `${day ? day.name : dayId} ${meal ? meal.label : mealId}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Shopping List
    btnOpenShoppingList.addEventListener('click', openShoppingListModal);
    btnCopyShoppingList.addEventListener('click', copyShoppingListToClipboard);
    btnUncheckAllShopping.addEventListener('click', uncheckAllShoppingItems);

    // Clear Week
    btnClearWeek.addEventListener('click', confirmClearWeek);

    // Backup & Restore
    btnExportBackup.addEventListener('click', exportBackup);
    importBackupInput.addEventListener('change', importBackup);

    // Desktop/Tablet Sidebar Toggle
    if (btnToggleSidebarDesktop) {
      btnToggleSidebarDesktop.addEventListener('click', () => {
        recipeSidebar.classList.toggle('is-collapsed');
      });
    }

    // Mobile / Tablet Bottom Navigation
    if (navBtnCalendar) {
      navBtnCalendar.addEventListener('click', () => {
        recipeSidebar.classList.remove('is-open');
        sidebarBackdrop.classList.remove('is-open');
        if (calendarMain) {
          calendarMain.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (navBtnRecipes) {
      navBtnRecipes.addEventListener('click', () => {
        recipeSidebar.classList.toggle('is-open');
        sidebarBackdrop.classList.toggle('is-open');
      });
    }

    if (navBtnAddRecipe) {
      navBtnAddRecipe.addEventListener('click', openAddRecipeModal);
    }

    if (navBtnShopping) {
      navBtnShopping.addEventListener('click', openShoppingListModal);
    }

    // Add Recipe Modal
    btnOpenAddRecipeModal.addEventListener('click', openAddRecipeModal);
    btnAddIngredientRow.addEventListener('click', () => addIngredientInputRow());
    recipeForm.addEventListener('submit', handleRecipeFormSubmit);

    // Recipe Search & Category Filter
    recipeSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      btnClearSearch.style.display = currentSearchQuery ? 'block' : 'none';
      renderRecipeSidebar();
    });

    btnClearSearch.addEventListener('click', () => {
      recipeSearchInput.value = '';
      currentSearchQuery = '';
      btnClearSearch.style.display = 'none';
      renderRecipeSidebar();
    });

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategoryFilter = pill.dataset.category;
        renderRecipeSidebar();
      });
    });

    // Mobile / Tablet Sidebar Drawer Triggers
    if (btnToggleMobileSidebar) {
      btnToggleMobileSidebar.addEventListener('click', () => {
        recipeSidebar.classList.add('is-open');
        sidebarBackdrop.classList.add('is-open');
      });
    }

    if (btnCloseMobileSidebar) {
      btnCloseMobileSidebar.addEventListener('click', () => {
        recipeSidebar.classList.remove('is-open');
        sidebarBackdrop.classList.remove('is-open');
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        recipeSidebar.classList.remove('is-open');
        sidebarBackdrop.classList.remove('is-open');
      });
    }

    // Mobile / Tablet Day Tabs
    dayTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dayTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMobileDayFilter = btn.dataset.day;
        renderWeeklyCalendar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Slot Picker Modal Search
    pickerSearchInput.addEventListener('input', (e) => {
      renderSlotPickerList(e.target.value);
    });

    // Recipe Detail Modal "Assign to Calendar" Button
    btnAssignFromDetail.addEventListener('click', () => {
      if (currentlySelectedRecipeForAssign) {
        closeModal(recipeDetailModal);
        openQuickAssignModal(currentlySelectedRecipeForAssign);
      }
    });

    // Quick Assign Form
    quickAssignForm.addEventListener('submit', handleQuickAssignSubmit);

    // Confirm Modal Actions
    btnCancelConfirm.addEventListener('click', () => {
      closeModal(confirmModal);
      pendingConfirmAction = null;
    });

    btnProceedConfirm.addEventListener('click', () => {
      if (typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
      }
      closeModal(confirmModal);
      pendingConfirmAction = null;
    });

    // Generic Modal Close Triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        const modalEl = document.getElementById(modalId);
        closeModal(modalEl);
      });
    });

    // Close modal on clicking outside backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal(backdrop);
        }
      });
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal-backdrop.is-open');
        openModals.forEach(modal => closeModal(modal));
        recipeSidebar.classList.remove('is-open');
        sidebarBackdrop.classList.remove('is-open');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
