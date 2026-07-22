import { ChapterMeta } from '../types';

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    code: 'CH01',
    title: 'Chapter 1: Introduction to Anatomy and Physiology',
    description: 'Origins of medical science, levels of organization, core themes, characteristics & maintenance of life, body cavities, membranes, and anatomical terminology.',
    examName: 'Lecture Exam 1',
    questionCount: 15,
    csvFileName: 'Chapter_01_MCQs.csv',
    hasData: true,
    subjects: ['A - Body Plan & Organization', 'B - Homeostasis']
  },
  {
    id: 2,
    code: 'CH02',
    title: 'Chapter 2: Chemical Basis of Life',
    description: 'Atoms, ions, chemical bonds, water properties, inorganic & organic compounds, pH, carbohydrates, lipids, proteins, nucleic acids.',
    examName: 'Lecture Exam 1',
    questionCount: 15,
    csvFileName: 'Chapter_02_MCQs.csv',
    hasData: true,
    subjects: ['C - Chemistry & Cell Biology']
  },
  {
    id: 3,
    code: 'CH03',
    title: 'Chapter 3: Cellular Level of Organization',
    description: 'Cell structure, organelle functions, membrane transport (diffusion, osmosis, active transport), cell cycle, mitosis, stem cells & differentiation.',
    examName: 'Lecture Exam 1',
    questionCount: 15,
    csvFileName: 'Chapter_03_MCQs.csv',
    hasData: true,
    subjects: ['C - Chemistry & Cell Biology']
  },
  {
    id: 4,
    code: 'CH04',
    title: 'Chapter 4: Cellular Metabolism',
    description: 'Metabolic processes, anabolic & catabolic reactions, enzyme kinetics & inhibition, ATP cycle, cellular respiration (glycolysis, citric acid cycle, electron transport chain).',
    examName: 'Lecture Exam 1',
    questionCount: 15,
    csvFileName: 'Chapter_04_MCQs.csv',
    hasData: false,
    subjects: ['C - Chemistry & Cell Biology']
  },
  {
    id: 5,
    code: 'CH05',
    title: 'Chapter 5: Tissues (Histology)',
    description: 'Epithelial tissues, connective tissues, muscle tissues, nervous tissues, intercellular junctions, glandular secretion, and tissue repair.',
    examName: 'Lecture Exam 2',
    questionCount: 15,
    csvFileName: 'Chapter_05_MCQs.csv',
    hasData: false,
    subjects: ['D - Histology & Integumentary System']
  },
  {
    id: 6,
    code: 'CH06',
    title: 'Chapter 6: Integumentary System',
    description: 'Epidermal layers, dermis, subcutaneous layer, skin color pigments, hair, nails, sweat & sebaceous glands, cutaneous sensation, wound healing.',
    examName: 'Lecture Exam 2',
    questionCount: 15,
    csvFileName: 'Chapter_06_MCQs.csv',
    hasData: false,
    subjects: ['D - Histology & Integumentary System']
  },
  {
    id: 7,
    code: 'CH07',
    title: 'Chapter 7: Skeletal System',
    description: 'Bone tissue histology, ossification (intramembranous & endochondral), axial & appendicular skeleton, bone remodeling, calcium homeostasis.',
    examName: 'Lecture Exam 2',
    questionCount: 15,
    csvFileName: 'Chapter_07_MCQs.csv',
    hasData: false,
    subjects: ['E - Skeletal System & Joints']
  },
  {
    id: 8,
    code: 'CH08',
    title: 'Chapter 8: Joints of the Skeletal System',
    description: 'Joint classification (fibrous, cartilaginous, synovial), synovial joint anatomy, joint movements (flexion, extension, abduction, adduction, rotation).',
    examName: 'Lecture Exam 2',
    questionCount: 15,
    csvFileName: 'Chapter_08_MCQs.csv',
    hasData: false,
    subjects: ['E - Skeletal System & Joints']
  },
  {
    id: 9,
    code: 'CH09',
    title: 'Chapter 9: Muscular System',
    description: 'Skeletal muscle structure, neuromuscular junction, sliding filament theory, excitation-contraction coupling, muscle metabolism, twitch & tetanus.',
    examName: 'Lecture Exam 3',
    questionCount: 15,
    csvFileName: 'Chapter_09_MCQs.csv',
    hasData: false,
    subjects: ['F - Muscular System & Contraction']
  },
  {
    id: 10,
    code: 'CH10',
    title: 'Chapter 10: Nervous System I – Basic Structure and Function',
    description: 'Neuron anatomy, neuroglia, resting membrane potential, graded & action potentials, propagation, synaptic transmission, neurotransmitters.',
    examName: 'Lecture Exam 3',
    questionCount: 15,
    csvFileName: 'Chapter_10_MCQs.csv',
    hasData: false,
    subjects: ['G - Nervous System & Action Potentials']
  },
  {
    id: 11,
    code: 'CH11',
    title: 'Chapter 11: Nervous System II – Divisions of the Nervous System',
    description: 'Central nervous system (brain & spinal cord), meninges, cerebrospinal fluid, cranial & spinal nerves, somatic & autonomic nervous system (sympathetic vs parasympathetic).',
    examName: 'Lecture Exam 4',
    questionCount: 15,
    csvFileName: 'Chapter_11_MCQs.csv',
    hasData: false,
    subjects: ['G - Nervous System & Action Potentials']
  },
  {
    id: 12,
    code: 'CH12',
    title: 'Chapter 12: Nervous System III – Somatic and Special Senses',
    description: 'Receptors & sensation, somatic senses (touch, pressure, temperature, pain), special senses (olfaction, gustation, vision, hearing, equilibrium).',
    examName: 'Lecture Exam 4',
    questionCount: 15,
    csvFileName: 'Chapter_12_MCQs.csv',
    hasData: false,
    subjects: ['G - Nervous System & Action Potentials']
  }
];
