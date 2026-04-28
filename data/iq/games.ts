import type {
  AgeGroup,
  CategoryId,
  Difficulty,
  Game,
  GameTemplate,
  LocalizedString,
  SkillId,
} from "./types";
import { CATEGORY_ICON, CATEGORY_PALETTES } from "./constants";

interface GameSeed {
  category: CategoryId;
  template: GameTemplate;
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  duration: number;
  points: number;
  recommended?: boolean;
  titles: LocalizedString;
  desc: LocalizedString;
}

function l(fr: string, ar: string, en: string): LocalizedString {
  return { fr, ar, en };
}

function instructionsFor(template: GameTemplate): LocalizedString {
  switch (template) {
    case "multipleChoice":
      return l(
        "Lis la question, choisis la bonne réponse parmi les options.",
        "اقرأ السؤال واختر الإجابة الصحيحة من الخيارات.",
        "Read the question and pick the right answer.",
      );
    case "memoryCards":
      return l(
        "Mémorise la séquence puis reproduis-la.",
        "احفظ التسلسل ثم أعد ترتيبه.",
        "Memorize the sequence, then reproduce it.",
      );
    case "patternSequence":
      return l(
        "Trouve l'élément suivant qui complète le motif.",
        "اعثر على العنصر التالي الذي يكمل النمط.",
        "Find the next element that completes the pattern.",
      );
    case "dragMatch":
      return l(
        "Associe chaque élément à sa paire.",
        "صل كل عنصر بزوجه المناسب.",
        "Match each item with its pair.",
      );
    case "oddOneOut":
      return l(
        "Trouve l'intrus parmi les éléments.",
        "اعثر على العنصر المختلف.",
        "Find the odd one out.",
      );
    case "mathChallenge":
      return l(
        "Résous le calcul rapidement.",
        "احسب بسرعة وأجب.",
        "Solve the math problem quickly.",
      );
    case "shapeRecognition":
      return l(
        "Identifie la forme demandée.",
        "تعرّف على الشكل المطلوب.",
        "Identify the requested shape.",
      );
    case "wordMatching":
      return l(
        "Associe le mot à son image.",
        "صل الكلمة بصورتها.",
        "Match the word with its image.",
      );
    case "sortingGame":
      return l(
        "Range les éléments dans le bon ordre.",
        "رتب العناصر بالترتيب الصحيح.",
        "Sort the items in the right order.",
      );
    case "mazeLogic":
      return l(
        "Trouve le chemin qui mène à la sortie.",
        "اعثر على الطريق إلى الخروج.",
        "Find the path that leads to the exit.",
      );
  }
}

const SEEDS: GameSeed[] = [
  // === LOGIC (12)
  {
    category: "logic", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 10, recommended: true,
    titles: l("Mission logique", "مهمة المنطق", "Logic Mission"),
    desc: l("Résous des énigmes simples pour entraîner la logique.", "حل ألغاز بسيطة لتدريب التفكير المنطقي.", "Solve simple riddles to train logic."),
  },
  {
    category: "logic", template: "oddOneOut", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10,
    titles: l("Trouve l'intrus", "اعثر على المختلف", "Find the Odd One"),
    desc: l("Identifie l'élément qui n'appartient pas au groupe.", "حدد العنصر الذي لا ينتمي للمجموعة.", "Spot the element that does not belong."),
  },
  {
    category: "logic", template: "patternSequence", ageGroup: "9-12", difficulty: "medium", duration: 6, points: 15, recommended: true,
    titles: l("Train de la logique", "قطار المنطق", "Logic Train"),
    desc: l("Devine quel wagon vient ensuite.", "خمّن العربة التالية.", "Guess which carriage comes next."),
  },
  {
    category: "logic", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 15,
    titles: l("Animal logique", "منطق الحيوانات", "Animal Logic"),
    desc: l("Déduis la catégorie animale grâce aux indices.", "استنتج فئة الحيوان من الأدلة.", "Deduce the animal category from clues."),
  },
  {
    category: "logic", template: "mazeLogic", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Labyrinthe des idées", "متاهة الأفكار", "Idea Maze"),
    desc: l("Trouve le bon chemin et évite les pièges.", "اختر الطريق الصحيح وتجنب الفخاخ.", "Find the right path, avoid traps."),
  },
  {
    category: "logic", template: "oddOneOut", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 20,
    titles: l("Détective logique", "محقق منطقي", "Logic Detective"),
    desc: l("Mène l'enquête en éliminant les mauvaises pistes.", "حقق وحدد المسار الصحيح.", "Investigate and rule out wrong leads."),
  },
  {
    category: "logic", template: "multipleChoice", ageGroup: "13+", difficulty: "hard", duration: 10, points: 25,
    titles: l("Énigmes du sage", "ألغاز الحكيم", "Sage Riddles"),
    desc: l("Des énigmes pour les grands.", "ألغاز للأذكياء.", "Riddles for older kids."),
  },
  {
    category: "logic", template: "patternSequence", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Défi du génie logique", "تحدي عبقري المنطق", "Logic Genius Challenge"),
    desc: l("Le défi ultime de la logique.", "التحدي الأقصى للمنطق.", "The ultimate logic challenge."),
  },
  {
    category: "logic", template: "multipleChoice", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petit logicien", "المنطقي الصغير", "Little Logician"),
    desc: l("Premiers pas en logique pour les tout-petits.", "خطوات أولى في المنطق للصغار.", "First logic steps for little ones."),
  },
  {
    category: "logic", template: "sortingGame", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Tri logique", "الترتيب المنطقي", "Logic Sort"),
    desc: l("Range les objets par règles logiques.", "رتب الأشياء وفق القواعد.", "Sort objects by logical rules."),
  },
  {
    category: "logic", template: "dragMatch", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Cause et effet", "السبب والنتيجة", "Cause & Effect"),
    desc: l("Associe une cause à son effet.", "صل السبب بنتيجته.", "Match a cause with its effect."),
  },
  {
    category: "logic", template: "multipleChoice", ageGroup: "9-12", difficulty: "hard", duration: 9, points: 22,
    titles: l("Vrai ou faux ?", "صح أم خطأ؟", "True or False?"),
    desc: l("Décide si l'affirmation est correcte.", "حدد إن كانت العبارة صحيحة.", "Decide if the statement is correct."),
  },

  // === MATH (12)
  {
    category: "math", template: "mathChallenge", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10, recommended: true,
    titles: l("Math Rocket", "صاروخ الرياضيات", "Math Rocket"),
    desc: l("Lance la fusée en répondant aux additions.", "أطلق الصاروخ بإجابة الجمع.", "Launch the rocket by solving additions."),
  },
  {
    category: "math", template: "mathChallenge", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10,
    titles: l("Défi des nombres", "تحدي الأعداد", "Number Challenge"),
    desc: l("Compte vite et bien.", "احسب بسرعة ودقة.", "Count fast and accurate."),
  },
  {
    category: "math", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Tour des nombres", "برج الأعداد", "Number Tower"),
    desc: l("Construis la tour en suivant la suite.", "ابنِ البرج وفق التسلسل.", "Build the tower by following the sequence."),
  },
  {
    category: "math", template: "mathChallenge", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18, recommended: true,
    titles: l("Calcul éclair", "حساب البرق", "Lightning Math"),
    desc: l("Réponds avant que le temps s'écoule !", "أجب قبل انتهاء الوقت!", "Answer before time runs out!"),
  },
  {
    category: "math", template: "mathChallenge", ageGroup: "9-12", difficulty: "hard", duration: 9, points: 22,
    titles: l("Multipli-Maître", "أستاذ الضرب", "Multi-Master"),
    desc: l("Maîtrise les tables de multiplication.", "أتقن جداول الضرب.", "Master multiplication tables."),
  },
  {
    category: "math", template: "multipleChoice", ageGroup: "13+", difficulty: "hard", duration: 10, points: 25,
    titles: l("Algèbre Junior", "جبر الناشئين", "Junior Algebra"),
    desc: l("Découvre les équations simples.", "اكتشف المعادلات البسيطة.", "Discover simple equations."),
  },
  {
    category: "math", template: "multipleChoice", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Génie des maths", "عبقري الرياضيات", "Math Genius"),
    desc: l("Le défi ultime des maths.", "التحدي الأقصى للرياضيات.", "The ultimate math challenge."),
  },
  {
    category: "math", template: "sortingGame", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petits chiffres", "الأرقام الصغيرة", "Tiny Numbers"),
    desc: l("Range les chiffres de 1 à 10.", "رتب الأعداد من 1 إلى 10.", "Sort numbers from 1 to 10."),
  },
  {
    category: "math", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Formes & nombres", "الأشكال والأعداد", "Shapes & Numbers"),
    desc: l("Compte les formes pour gagner.", "عد الأشكال للفوز.", "Count the shapes to win."),
  },
  {
    category: "math", template: "mathChallenge", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Tableau magique", "اللوحة السحرية", "Magic Board"),
    desc: l("Complète les cases magiques.", "أكمل المربعات السحرية.", "Fill the magic squares."),
  },
  {
    category: "math", template: "dragMatch", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Pièces du puzzle math", "قطع لغز الرياضيات", "Math Puzzle Pieces"),
    desc: l("Associe les opérations à leur résultat.", "صل العملية بنتيجتها.", "Match operations with results."),
  },
  {
    category: "math", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Fractions amusantes", "الكسور الممتعة", "Fun Fractions"),
    desc: l("Joue avec les fractions.", "العب مع الكسور.", "Play with fractions."),
  },

  // === MEMORY (12)
  {
    category: "memory", template: "memoryCards", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 10, recommended: true,
    titles: l("Memory Stars", "نجوم الذاكرة", "Memory Stars"),
    desc: l("Retrouve les paires d'étoiles cachées.", "اعثر على أزواج النجوم.", "Find the matching star pairs."),
  },
  {
    category: "memory", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Séquence magique", "التسلسل السحري", "Magic Sequence"),
    desc: l("Reproduis la séquence lumineuse.", "أعد التسلسل المضيء.", "Reproduce the glowing sequence."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Mémoire visuelle", "الذاكرة البصرية", "Visual Memory"),
    desc: l("Souviens-toi des images.", "تذكر الصور.", "Remember the images."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Mémoire d'éléphant", "ذاكرة الفيل", "Elephant Memory"),
    desc: l("Souviens-toi de longues séquences.", "احفظ تسلسلات طويلة.", "Remember long sequences."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Mémoire absolue", "الذاكرة المطلقة", "Total Recall"),
    desc: l("Le défi ultime de la mémoire.", "تحدي الذاكرة الأقصى.", "The ultimate memory challenge."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petits souvenirs", "ذكريات صغيرة", "Tiny Memories"),
    desc: l("Trouve la paire d'animaux.", "اعثر على زوج الحيوان.", "Find the animal pair."),
  },
  {
    category: "memory", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Note par note", "نغمة بنغمة", "Note by Note"),
    desc: l("Reproduis la mélodie cachée.", "أعد اللحن المخفي.", "Repeat the hidden melody."),
  },
  {
    category: "memory", template: "dragMatch", ageGroup: "9-12", difficulty: "medium", duration: 6, points: 15,
    titles: l("Souviens-toi des couleurs", "تذكر الألوان", "Color Recall"),
    desc: l("Mémorise puis associe les couleurs.", "احفظ ثم صل الألوان.", "Memorize then match colors."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10,
    titles: l("Galaxie souvenirs", "مجرة الذكريات", "Memory Galaxy"),
    desc: l("Visite une galaxie pleine de paires.", "اكتشف مجرة الأزواج.", "Explore a galaxy full of pairs."),
  },
  {
    category: "memory", template: "memoryCards", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22, recommended: true,
    titles: l("Mémoire des héros", "ذاكرة الأبطال", "Hero Memory"),
    desc: l("Retrouve les héros et leurs symboles.", "اعثر على الأبطال ورموزهم.", "Match heroes with their symbols."),
  },
  {
    category: "memory", template: "patternSequence", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Code mental", "الشيفرة الذهنية", "Mind Code"),
    desc: l("Mémorise le code et reproduis-le.", "احفظ الرمز ثم أعد إدخاله.", "Memorize the code and repeat it."),
  },
  {
    category: "memory", template: "dragMatch", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Mini paires", "أزواج صغيرة", "Mini Pairs"),
    desc: l("Trouve les paires pour les petits.", "اعثر على الأزواج للصغار.", "Find pairs for little ones."),
  },

  // === PATTERN (12)
  {
    category: "pattern", template: "patternSequence", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10, recommended: true,
    titles: l("Pattern Castle", "قلعة الأنماط", "Pattern Castle"),
    desc: l("Construis le château en suivant les motifs.", "ابنِ القلعة باتباع الأنماط.", "Build the castle by following patterns."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Suite des couleurs", "تتابع الألوان", "Color Sequence"),
    desc: l("Continue la suite colorée.", "أكمل تتابع الألوان.", "Continue the color sequence."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Motifs en miroir", "أنماط المرآة", "Mirror Patterns"),
    desc: l("Trouve le reflet du motif.", "اعثر على انعكاس النمط.", "Find the pattern's reflection."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "9-12", difficulty: "hard", duration: 9, points: 22,
    titles: l("Fractales magiques", "كسور سحرية", "Magic Fractals"),
    desc: l("Devine la prochaine fractale.", "خمّن النمط القادم.", "Guess the next fractal."),
  },
  {
    category: "pattern", template: "oddOneOut", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Le motif différent", "النمط المختلف", "Different Pattern"),
    desc: l("Trouve le motif qui ne correspond pas.", "اعثر على النمط المختلف.", "Find the pattern that doesn't fit."),
  },
  {
    category: "pattern", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petits motifs", "أنماط صغيرة", "Tiny Patterns"),
    desc: l("Reconnaître les motifs simples.", "تعرف على الأنماط البسيطة.", "Recognize simple patterns."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Architecte des motifs", "مهندس الأنماط", "Pattern Architect"),
    desc: l("Construis des motifs complexes.", "صمم أنماطاً معقدة.", "Design complex patterns."),
  },
  {
    category: "pattern", template: "dragMatch", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Motif et image", "النمط والصورة", "Pattern & Picture"),
    desc: l("Associe le motif à l'image.", "صل النمط بالصورة.", "Match the pattern with the image."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Vague des formes", "موجة الأشكال", "Shape Wave"),
    desc: l("Surfe sur la vague de motifs.", "تابع موجة الأشكال.", "Ride the shape wave."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Mosaïque", "الفسيفساء", "Mosaic"),
    desc: l("Complète la mosaïque colorée.", "أكمل الفسيفساء الملونة.", "Complete the colorful mosaic."),
  },
  {
    category: "pattern", template: "shapeRecognition", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 20,
    titles: l("Motifs cachés", "أنماط مخفية", "Hidden Patterns"),
    desc: l("Trouve les motifs cachés dans l'image.", "اكتشف الأنماط المخفية.", "Spot hidden patterns in the image."),
  },
  {
    category: "pattern", template: "patternSequence", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Code secret", "الرمز السري", "Secret Code"),
    desc: l("Décode la suite secrète.", "فك الرمز السري.", "Decode the secret sequence."),
  },

  // === LANGUAGE (12)
  {
    category: "language", template: "wordMatching", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 10, recommended: true,
    titles: l("Word Explorer", "مستكشف الكلمات", "Word Explorer"),
    desc: l("Découvre de nouveaux mots.", "اكتشف كلمات جديدة.", "Discover new words."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Mot mystère", "الكلمة الغامضة", "Mystery Word"),
    desc: l("Devine le mot caché.", "خمّن الكلمة المخفية.", "Guess the hidden word."),
  },
  {
    category: "language", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Histoires courtes", "قصص قصيرة", "Short Stories"),
    desc: l("Comprends une histoire et réponds.", "افهم القصة وأجب.", "Read a story and answer."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Synonymes & contraires", "المرادفات والأضداد", "Synonyms & Opposites"),
    desc: l("Associe les mots à leur synonyme ou opposé.", "صل الكلمات بمرادفها أو ضدها.", "Match synonyms or opposites."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Premiers mots", "كلماتي الأولى", "First Words"),
    desc: l("Découvre les premiers mots.", "اكتشف الكلمات الأولى.", "Learn first words."),
  },
  {
    category: "language", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Le mot intrus", "الكلمة المختلفة", "Odd Word Out"),
    desc: l("Trouve le mot qui ne va pas.", "اعثر على الكلمة المختلفة.", "Find the word that doesn't fit."),
  },
  {
    category: "language", template: "sortingGame", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Phrase en ordre", "ترتيب الجملة", "Sentence Order"),
    desc: l("Range les mots dans le bon ordre.", "رتب الكلمات لتكوين جملة.", "Order the words to form a sentence."),
  },
  {
    category: "language", template: "multipleChoice", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Vocabulaire avancé", "مفردات متقدمة", "Advanced Vocabulary"),
    desc: l("Apprends des mots plus rares.", "تعلم كلمات نادرة.", "Learn rarer words."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Animaux & sons", "الحيوانات والأصوات", "Animal Sounds"),
    desc: l("Associe l'animal à son cri.", "صل الحيوان بصوته.", "Match animals with their sounds."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18, recommended: true,
    titles: l("Devinettes", "ألغاز كلامية", "Word Riddles"),
    desc: l("Devine le mot grâce aux indices.", "خمّن الكلمة من الأدلة.", "Guess the word from clues."),
  },
  {
    category: "language", template: "multipleChoice", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Maître des mots", "سيد الكلمات", "Word Master"),
    desc: l("Le défi ultime du langage.", "التحدي الأقصى للغة.", "Ultimate language challenge."),
  },
  {
    category: "language", template: "wordMatching", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Famille de mots", "عائلة الكلمات", "Word Family"),
    desc: l("Regroupe les mots par famille.", "اجمع الكلمات بحسب الفئة.", "Group words by family."),
  },

  // === ATTENTION (12)
  {
    category: "attention", template: "oddOneOut", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10, recommended: true,
    titles: l("Quick Focus", "تركيز سريع", "Quick Focus"),
    desc: l("Repère vite l'élément différent.", "اكتشف العنصر المختلف بسرعة.", "Quickly spot the odd element."),
  },
  {
    category: "attention", template: "oddOneOut", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Trouve l'objet", "اعثر على الشيء", "Find the Object"),
    desc: l("Repère l'objet caché.", "اكتشف الشيء المخفي.", "Spot the hidden object."),
  },
  {
    category: "attention", template: "memoryCards", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Concentration zen", "تركيز هادئ", "Zen Focus"),
    desc: l("Reste calme et concentré.", "ابقَ هادئاً ومركزاً.", "Stay calm and focused."),
  },
  {
    category: "attention", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petit observateur", "المراقب الصغير", "Little Observer"),
    desc: l("Observe et trouve les détails.", "لاحظ التفاصيل.", "Observe and spot the details."),
  },
  {
    category: "attention", template: "oddOneOut", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Détective de l'attention", "محقق الانتباه", "Attention Detective"),
    desc: l("Trouve les indices invisibles.", "اعثر على الأدلة الخفية.", "Find the invisible clues."),
  },
  {
    category: "attention", template: "patternSequence", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Cible mouvante", "هدف متحرك", "Moving Target"),
    desc: l("Suis la cible avec précision.", "تابع الهدف بدقة.", "Follow the target precisely."),
  },
  {
    category: "attention", template: "oddOneOut", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Concentration max", "أقصى تركيز", "Max Focus"),
    desc: l("Trouve les détails sous pression.", "اعثر على التفاصيل بسرعة.", "Find details under pressure."),
  },
  {
    category: "attention", template: "memoryCards", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Suis le rythme", "تابع الإيقاع", "Follow the Rhythm"),
    desc: l("Garde le rythme et reste attentif.", "حافظ على الإيقاع.", "Keep the rhythm and stay alert."),
  },
  {
    category: "attention", template: "oddOneOut", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Choisis vite", "اختر بسرعة", "Quick Pick"),
    desc: l("Sélectionne la bonne cible avant le temps.", "اختر الهدف الصحيح بسرعة.", "Pick the right target in time."),
  },
  {
    category: "attention", template: "shapeRecognition", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10,
    titles: l("Yeux de lynx", "عيون النسر", "Eagle Eyes"),
    desc: l("Trouve la petite différence.", "اكتشف الفرق الصغير.", "Find the small difference."),
  },
  {
    category: "attention", template: "patternSequence", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Concentration extrême", "تركيز شديد", "Extreme Focus"),
    desc: l("Plus les motifs vont vite, plus c'est dur.", "كلما تسارعت الأنماط زادت الصعوبة.", "Faster patterns, harder challenge."),
  },
  {
    category: "attention", template: "oddOneOut", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Maître Zen", "سيد التأمل", "Zen Master"),
    desc: l("Le défi ultime de l'attention.", "التحدي الأقصى للانتباه.", "Ultimate attention challenge."),
  },

  // === SPATIAL (12)
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10, recommended: true,
    titles: l("Puzzle des formes", "لغز الأشكال", "Shape Puzzle"),
    desc: l("Assemble les formes pour gagner.", "ركّب الأشكال للفوز.", "Assemble shapes to win."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "9-12", difficulty: "medium", duration: 6, points: 15,
    titles: l("Brain Blocks", "كتل الدماغ", "Brain Blocks"),
    desc: l("Construis avec des blocs intelligents.", "ابنِ بالكتل الذكية.", "Build with smart blocks."),
  },
  {
    category: "spatial", template: "mazeLogic", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Grand labyrinthe", "المتاهة الكبيرة", "Big Maze"),
    desc: l("Sors du labyrinthe spatial.", "اخرج من المتاهة.", "Escape the spatial maze."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Vue 3D", "رؤية ثلاثية الأبعاد", "3D View"),
    desc: l("Imagine la forme depuis un autre angle.", "تخيل الشكل من زاوية أخرى.", "Imagine the shape from another angle."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petites formes", "أشكال صغيرة", "Tiny Shapes"),
    desc: l("Reconnaître carré, rond, triangle.", "تعرّف على الأشكال الأساسية.", "Recognize basic shapes."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Détective des formes", "محقق الأشكال", "Shape Detective"),
    desc: l("Trouve la forme demandée.", "اعثر على الشكل المطلوب.", "Find the requested shape."),
  },
  {
    category: "spatial", template: "mazeLogic", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Cube perdu", "المكعب الضائع", "Lost Cube"),
    desc: l("Replace les cubes en 3D.", "أعد ترتيب المكعبات.", "Reorder the 3D cubes."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Origami virtuel", "أوريغامي افتراضي", "Virtual Origami"),
    desc: l("Plie virtuellement les formes.", "اطوِ الأشكال افتراضياً.", "Fold shapes virtually."),
  },
  {
    category: "spatial", template: "mazeLogic", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Galaxie 3D", "مجرة ثلاثية الأبعاد", "Galaxy 3D"),
    desc: l("Navigue dans la galaxie 3D.", "تنقل في مجرة ثلاثية الأبعاد.", "Navigate the 3D galaxy."),
  },
  {
    category: "spatial", template: "dragMatch", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Avant / Après", "قبل وبعد", "Before / After"),
    desc: l("Range les images dans l'ordre.", "رتب الصور بالترتيب.", "Order the images."),
  },
  {
    category: "spatial", template: "mazeLogic", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Carte au trésor", "خريطة الكنز", "Treasure Map"),
    desc: l("Trouve la carte du trésor.", "اعثر على خريطة الكنز.", "Find the treasure map."),
  },
  {
    category: "spatial", template: "shapeRecognition", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Tetris junior", "تيتريس صغير", "Junior Tetris"),
    desc: l("Place les formes parfaitement.", "ضع الأشكال بإتقان.", "Place shapes perfectly."),
  },

  // === CREATIVITY (12)
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12, recommended: true,
    titles: l("Creative Builder", "بناء مبدع", "Creative Builder"),
    desc: l("Construis ton univers imaginaire.", "ابنِ عالمك الخيالي.", "Build your imaginary universe."),
  },
  {
    category: "creativity", template: "dragMatch", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Color Sorter", "مصنف الألوان", "Color Sorter"),
    desc: l("Range les couleurs avec art.", "رتب الألوان بفن.", "Sort colors with style."),
  },
  {
    category: "creativity", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Idée à imaginer", "فكرة لتخيلها", "Imagine It"),
    desc: l("Choisis l'idée la plus créative.", "اختر الفكرة الأكثر إبداعاً.", "Pick the most creative idea."),
  },
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Mini artistes", "فنانون صغار", "Mini Artists"),
    desc: l("Découvre l'art en formes simples.", "اكتشف الفن بأشكال بسيطة.", "Discover art with simple shapes."),
  },
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Tableau abstrait", "لوحة تجريدية", "Abstract Canvas"),
    desc: l("Crée des œuvres d'art.", "أبدع أعمالاً فنية.", "Create artworks."),
  },
  {
    category: "creativity", template: "dragMatch", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Conte à raconter", "قصة لتُحكى", "Story to Tell"),
    desc: l("Compose une histoire courte.", "ابتكر قصة قصيرة.", "Make up a short story."),
  },
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Designer en herbe", "مصمم ناشئ", "Young Designer"),
    desc: l("Crée un design unique.", "صمم شيئاً فريداً.", "Design something unique."),
  },
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Mini Picasso", "بيكاسو الصغير", "Mini Picasso"),
    desc: l("L'expression artistique ultime.", "التعبير الفني الأقصى.", "Ultimate artistic expression."),
  },
  {
    category: "creativity", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Atelier d'idées", "ورشة الأفكار", "Idea Workshop"),
    desc: l("Partage tes idées créatives.", "شارك أفكارك الإبداعية.", "Share your creative ideas."),
  },
  {
    category: "creativity", template: "dragMatch", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Mots et images", "الكلمات والصور", "Words & Pictures"),
    desc: l("Associe le mot à l'œuvre.", "صل الكلمة بالعمل الفني.", "Match the word to the artwork."),
  },
  {
    category: "creativity", template: "sortingGame", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Univers à inventer", "عالم لتخترعه", "Invent Your World"),
    desc: l("Compose un monde imaginaire.", "ابتكر عالماً خيالياً.", "Build an imaginary world."),
  },
  {
    category: "creativity", template: "shapeRecognition", ageGroup: "9-12", difficulty: "easy", duration: 5, points: 12,
    titles: l("Couleurs harmonieuses", "ألوان منسجمة", "Color Harmony"),
    desc: l("Trouve les bonnes harmonies.", "اعثر على التناغمات.", "Find the right harmonies."),
  },

  // === PROBLEM (12)
  {
    category: "problem", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12, recommended: true,
    titles: l("Mission résolution", "مهمة حل المشكلات", "Solve Mission"),
    desc: l("Résous des petits problèmes du quotidien.", "حل مشكلات يومية بسيطة.", "Solve daily small problems."),
  },
  {
    category: "problem", template: "mazeLogic", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Chef d'expédition", "قائد الرحلة", "Expedition Lead"),
    desc: l("Conduis l'équipe à bon port.", "قُد فريقك بأمان.", "Lead your team safely."),
  },
  {
    category: "problem", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Énigmes du quotidien", "ألغاز يومية", "Daily Puzzles"),
    desc: l("Trouve la meilleure solution.", "اعثر على الحل الأفضل.", "Find the best solution."),
  },
  {
    category: "problem", template: "sortingGame", ageGroup: "6-8", difficulty: "medium", duration: 6, points: 15,
    titles: l("Plan d'action", "خطة عمل", "Action Plan"),
    desc: l("Organise les étapes du plan.", "نظم خطوات الخطة.", "Organize the plan's steps."),
  },
  {
    category: "problem", template: "multipleChoice", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Décision rapide", "قرار سريع", "Quick Decision"),
    desc: l("Choisis la meilleure option.", "اختر الخيار الأنسب.", "Pick the best option."),
  },
  {
    category: "problem", template: "mazeLogic", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Stratégie maître", "استراتيجية ماهرة", "Master Strategy"),
    desc: l("Anticipe les obstacles.", "توقّع العقبات.", "Anticipate the obstacles."),
  },
  {
    category: "problem", template: "multipleChoice", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petits soucis", "مشكلات صغيرة", "Tiny Troubles"),
    desc: l("Trouve une solution simple.", "اعثر على حل بسيط.", "Find a simple solution."),
  },
  {
    category: "problem", template: "multipleChoice", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Cerveau d'élite", "دماغ النخبة", "Elite Brain"),
    desc: l("Le défi ultime de la résolution.", "التحدي الأقصى لحل المشكلات.", "Ultimate problem solving."),
  },
  {
    category: "problem", template: "sortingGame", ageGroup: "9-12", difficulty: "easy", duration: 5, points: 12,
    titles: l("Priorités", "الأولويات", "Priorities"),
    desc: l("Organise les priorités.", "رتب الأولويات.", "Order priorities."),
  },
  {
    category: "problem", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Coopération", "التعاون", "Cooperation"),
    desc: l("Choisis la meilleure équipe.", "اختر الفريق المناسب.", "Pick the best team."),
  },
  {
    category: "problem", template: "patternSequence", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Plan B", "الخطة البديلة", "Plan B"),
    desc: l("Choisis le plan de secours.", "اختر الخطة البديلة.", "Pick the backup plan."),
  },
  {
    category: "problem", template: "mazeLogic", ageGroup: "6-8", difficulty: "easy", duration: 4, points: 10,
    titles: l("Petites énigmes", "ألغاز صغيرة", "Little Puzzles"),
    desc: l("De petites énigmes pour s'entraîner.", "ألغاز صغيرة للتدريب.", "Small puzzles to train."),
  },

  // === STEM (12)
  {
    category: "stem", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18, recommended: true,
    titles: l("STEM Bridge", "جسر العلوم", "STEM Bridge"),
    desc: l("Construis un pont solide grâce à la science.", "ابنِ جسراً متيناً بالعلوم.", "Build a strong bridge with science."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "9-12", difficulty: "hard", duration: 8, points: 22,
    titles: l("Petit ingénieur", "المهندس الصغير", "Little Engineer"),
    desc: l("Découvre les bases de l'ingénierie.", "اكتشف أساسيات الهندسة.", "Discover engineering basics."),
  },
  {
    category: "stem", template: "patternSequence", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Code & robots", "الكود والروبوتات", "Code & Robots"),
    desc: l("Découvre la programmation simple.", "تعرف على البرمجة البسيطة.", "Discover simple coding."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Petit physicien", "الفيزيائي الصغير", "Little Physicist"),
    desc: l("Explore les forces et l'énergie.", "اكتشف القوى والطاقة.", "Explore forces and energy."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "13+", difficulty: "genius", duration: 12, points: 35,
    titles: l("Astro Génie", "عبقري الفلك", "Astro Genius"),
    desc: l("Le défi ultime des sciences.", "التحدي الأقصى للعلوم.", "Ultimate science challenge."),
  },
  {
    category: "stem", template: "shapeRecognition", ageGroup: "3-5", difficulty: "easy", duration: 3, points: 8,
    titles: l("Petits scientifiques", "علماء صغار", "Mini Scientists"),
    desc: l("Premiers pas en sciences.", "خطوات أولى في العلوم.", "First science steps."),
  },
  {
    category: "stem", template: "patternSequence", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Robot programmer", "برمج الروبوت", "Robot Programmer"),
    desc: l("Programme le robot étape par étape.", "برمج الروبوت خطوة بخطوة.", "Program the robot step by step."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12,
    titles: l("Nature curieuse", "طبيعة فضولية", "Curious Nature"),
    desc: l("Découvre la nature et les animaux.", "اكتشف الطبيعة والحيوانات.", "Discover nature and animals."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "9-12", difficulty: "medium", duration: 7, points: 18,
    titles: l("Énergie verte", "الطاقة الخضراء", "Green Energy"),
    desc: l("Explore les énergies durables.", "اكتشف الطاقات المستدامة.", "Explore sustainable energy."),
  },
  {
    category: "stem", template: "patternSequence", ageGroup: "13+", difficulty: "hard", duration: 9, points: 24,
    titles: l("Astronome débutant", "فلكي مبتدئ", "Beginner Astronomer"),
    desc: l("Découvre les constellations.", "اكتشف الأبراج النجمية.", "Discover constellations."),
  },
  {
    category: "stem", template: "shapeRecognition", ageGroup: "6-8", difficulty: "easy", duration: 5, points: 12, recommended: true,
    titles: l("Cuisine des sciences", "مطبخ العلوم", "Science Kitchen"),
    desc: l("Apprends la chimie en t'amusant.", "تعلم الكيمياء باللعب.", "Learn chemistry by playing."),
  },
  {
    category: "stem", template: "multipleChoice", ageGroup: "13+", difficulty: "medium", duration: 7, points: 18,
    titles: l("Voyage dans l'espace", "رحلة إلى الفضاء", "Space Voyage"),
    desc: l("Explore le système solaire.", "اكتشف المجموعة الشمسية.", "Explore the solar system."),
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[àâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const GAMES: Game[] = SEEDS.map((seed, idx) => {
  const idNum = idx + 1;
  const slugBase = slugify(seed.titles.en);
  const slug = `${slugBase}-${String(idNum).padStart(3, "0")}`;
  return {
    id: `game-${String(idNum).padStart(3, "0")}`,
    slug,
    title: seed.titles,
    description: seed.desc,
    instructions: instructionsFor(seed.template),
    category: seed.category,
    skill: seed.category as SkillId,
    ageGroup: seed.ageGroup,
    difficulty: seed.difficulty,
    durationMinutes: seed.duration,
    gameType: seed.template,
    thumbnailPrompt: `${seed.titles.en} — premium pastel 3D card with rounded shapes and soft shadows`,
    icon: CATEGORY_ICON[seed.category],
    colorPalette: CATEGORY_PALETTES[seed.category],
    points: seed.points,
    recommended: !!seed.recommended,
    premium: false,
  };
});

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function listGames(): Game[] {
  return GAMES;
}

export function relatedGames(slug: string, limit = 4): Game[] {
  const target = getGame(slug);
  if (!target) return [];
  return GAMES.filter(
    (g) => g.slug !== slug && (g.category === target.category || g.skill === target.skill),
  ).slice(0, limit);
}

export function recommendByAge(ageGroup: string, limit = 6): Game[] {
  return GAMES.filter((g) => g.ageGroup === ageGroup).slice(0, limit);
}

export function recommendByWeakSkills(weak: string[], limit = 6): Game[] {
  if (!weak.length) return GAMES.filter((g) => g.recommended).slice(0, limit);
  return GAMES.filter((g) => weak.includes(g.skill)).slice(0, limit);
}
