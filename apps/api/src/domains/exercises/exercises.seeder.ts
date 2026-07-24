import { DataSource } from 'typeorm';
import { SkillCategoryEntity } from './skill-category.entity';
import { ExerciseEntity } from './exercise.entity';

export async function seedExercises(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(SkillCategoryEntity);
  const exerciseRepo = dataSource.getRepository(ExerciseEntity);

  const existing = await categoryRepo.count();
  if (existing > 0) {
    console.log('✅ Exercises already seeded, skipping.');
    return;
  }

  const categories = await categoryRepo.save([
    { name: 'Anatomy', slug: 'anatomy', description: 'Human figure, hands, faces, and body mechanics', iconName: 'body', sortOrder: 1 },
    { name: 'Perspective', slug: 'perspective', description: 'One, two, and three-point perspective drawing', iconName: 'cube', sortOrder: 2 },
    { name: 'Composition', slug: 'composition', description: 'Rule of thirds, visual flow, and image structure', iconName: 'layout', sortOrder: 3 },
    { name: 'Color Theory', slug: 'color-theory', description: 'Hue, value, saturation, and color harmony', iconName: 'palette', sortOrder: 4 },
    { name: 'Light & Shadow', slug: 'light-shadow', description: 'Form shadows, cast shadows, and rendering', iconName: 'sun', sortOrder: 5 },
    { name: 'Gesture Drawing', slug: 'gesture', description: 'Dynamic poses and figure movement', iconName: 'activity', sortOrder: 6 },
  ]);

  const [anatomy, perspective, composition, color, light, gesture] = categories;

  await exerciseRepo.save([
    // Anatomy
    {
      skillCategoryId: anatomy.id,
      title: 'Draw 20 Hands in Different Positions',
      description: 'Focus on capturing the underlying structure of the hand — the palm block, the finger segments, and knuckle placement. Use photo references from multiple angles.',
      difficulty: 'beginner',
      estimatedMinutes: 60,
      specificGoals: [
        { goal: 'Draw at least 20 distinct hand poses', measurable: true },
        { goal: 'Label the palm block vs. finger segments on at least 5 drawings', measurable: true },
        { goal: 'Include both front and back views', measurable: true },
      ],
      tags: ['hands', 'anatomy', 'structure'],
      isPublished: true,
    },
    {
      skillCategoryId: anatomy.id,
      title: 'Portrait Construction — The Loomis Method',
      description: 'Practice the Andrew Loomis head construction method: sphere + plane for the cranium, placement of the facial thirds, and ear positioning. Draw 10 heads at different angles.',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      specificGoals: [
        { goal: 'Construct 10 heads using sphere + plane method', measurable: true },
        { goal: 'Vary the angle across drawings (front, 3/4, profile)', measurable: true },
        { goal: 'Accurately place the facial thirds on each head', measurable: true },
      ],
      tags: ['portrait', 'head', 'loomis', 'anatomy'],
      isPublished: true,
    },
    {
      skillCategoryId: anatomy.id,
      title: 'Full Figure Écorché Study',
      description: 'Study and draw the major muscle groups of the human figure using écorché (skinned figure) references. Focus on one region per session: torso, arms, or legs.',
      difficulty: 'advanced',
      estimatedMinutes: 120,
      specificGoals: [
        { goal: 'Identify and label 10+ major muscle groups', measurable: true },
        { goal: 'Draw the selected region from at least 2 angles', measurable: true },
        { goal: 'Show muscle origin and insertion points with annotations', measurable: true },
      ],
      tags: ['figure', 'muscles', 'advanced', 'anatomy'],
      isPublished: true,
    },
    // Perspective
    {
      skillCategoryId: perspective.id,
      title: 'One-Point Perspective Room Interior',
      description: 'Draw a complete room interior using one-point perspective. Include furniture, a window, and at least one door. All receding lines must converge to a single vanishing point.',
      difficulty: 'beginner',
      estimatedMinutes: 45,
      specificGoals: [
        { goal: 'Establish a clear single vanishing point', measurable: true },
        { goal: 'Include at least 4 distinct objects in the room', measurable: true },
        { goal: 'Show the horizon line in your drawing', measurable: true },
      ],
      tags: ['perspective', 'interior', 'architecture'],
      isPublished: true,
    },
    {
      skillCategoryId: perspective.id,
      title: 'Cityscape with Two-Point Perspective',
      description: 'Design and draw a street-level cityscape using two-point perspective. Create at least 3 buildings with varying heights, including window and door details.',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      specificGoals: [
        { goal: 'Use correct two-point perspective throughout', measurable: true },
        { goal: 'Draw a minimum of 3 buildings of different heights', measurable: true },
        { goal: 'Add window and door details on at least 2 buildings', measurable: true },
      ],
      tags: ['perspective', 'cityscape', 'architecture'],
      isPublished: true,
    },
    {
      skillCategoryId: perspective.id,
      title: 'Complex Vehicle in Three-Point Perspective',
      description: 'Draw a vehicle (car, truck, or spaceship) using three-point perspective with a worm\'s-eye or bird\'s-eye view. Use construction lines and show your work.',
      difficulty: 'advanced',
      estimatedMinutes: 120,
      specificGoals: [
        { goal: 'Establish all three vanishing points correctly', measurable: true },
        { goal: 'Show visible construction lines to demonstrate process', measurable: true },
        { goal: 'The vehicle must be recognizable and proportionally correct', measurable: true },
      ],
      tags: ['perspective', 'vehicle', 'industrial'],
      isPublished: true,
    },
    // Composition
    {
      skillCategoryId: composition.id,
      title: 'Thumbnail Composition Studies — 9 Variations',
      description: 'Pick one subject and create 9 thumbnail compositions (3x3 inches each) applying different compositional rules: rule of thirds, golden spiral, symmetry, leading lines, and frame within frame.',
      difficulty: 'beginner',
      estimatedMinutes: 60,
      specificGoals: [
        { goal: 'Create exactly 9 thumbnails of the same subject', measurable: true },
        { goal: 'Apply a different compositional strategy to each', measurable: true },
        { goal: 'Label which rule each thumbnail uses', measurable: true },
      ],
      tags: ['composition', 'thumbnails', 'fundamentals'],
      isPublished: true,
    },
    {
      skillCategoryId: composition.id,
      title: 'Master Study — Compositional Analysis',
      description: 'Select a master painting (Caravaggio, Vermeer, Hopper, etc.) and recreate it in simplified black & white to analyze its compositional structure. Then draw your own scene using the same structure.',
      difficulty: 'intermediate',
      estimatedMinutes: 120,
      specificGoals: [
        { goal: 'Recreate the master work in simplified grayscale', measurable: true },
        { goal: 'Annotate the visual flow with arrows', measurable: true },
        { goal: 'Create an original scene using the same compositional structure', measurable: true },
      ],
      tags: ['composition', 'master-study', 'analysis'],
      isPublished: true,
    },
    {
      skillCategoryId: composition.id,
      title: 'Dynamic Narrative Scene Composition',
      description: 'Compose a scene that tells a clear story using advanced compositional techniques: depth through overlapping, atmospheric perspective, and a clear focal hierarchy.',
      difficulty: 'advanced',
      estimatedMinutes: 180,
      specificGoals: [
        { goal: 'The scene must communicate a clear narrative without text', measurable: true },
        { goal: 'Include at least 3 depth planes: fore/mid/background', measurable: true },
        { goal: 'Use atmospheric perspective to separate depth planes', measurable: true },
      ],
      tags: ['composition', 'narrative', 'scene'],
      isPublished: true,
    },
    // Color Theory
    {
      skillCategoryId: color.id,
      title: 'Color Mixing Chart — 12 Hue Wheel',
      description: 'Mix a 12-step color wheel using only primary colors (red, yellow, blue or CMYK primaries). Show intermediate mixes, then create value scales for each hue.',
      difficulty: 'beginner',
      estimatedMinutes: 60,
      specificGoals: [
        { goal: 'Paint all 12 steps of the color wheel', measurable: true },
        { goal: 'Create a 5-step value scale for at least 4 hues', measurable: true },
        { goal: 'Label each mixed color with its component hues', measurable: true },
      ],
      tags: ['color', 'mixing', 'fundamentals'],
      isPublished: true,
    },
    {
      skillCategoryId: color.id,
      title: 'Limited Palette Study — 3 Colors + White',
      description: 'Paint or color a still life using only 3 colors plus white. Study how limited palettes create visual harmony and force creative problem-solving in color mixing.',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      specificGoals: [
        { goal: 'Use no more than 3 hues plus white', measurable: true },
        { goal: 'Achieve a full value range from light to dark', measurable: true },
        { goal: 'Clearly convey the local color of each object', measurable: true },
      ],
      tags: ['color', 'limited-palette', 'still-life'],
      isPublished: true,
    },
    {
      skillCategoryId: color.id,
      title: 'Color Script for a Short Story Beat',
      description: 'Design a 6-panel color script for a short emotional story sequence. Each panel should use distinct color palettes that convey the emotional shift between beats.',
      difficulty: 'advanced',
      estimatedMinutes: 150,
      specificGoals: [
        { goal: 'Create 6 distinct color panels with visible emotional shift', measurable: true },
        { goal: 'Write a 1-sentence description of the emotion each panel targets', measurable: true },
        { goal: 'Justify your color choices in your artist notes', measurable: true },
      ],
      tags: ['color', 'storytelling', 'design'],
      isPublished: true,
    },
    // Light & Shadow
    {
      skillCategoryId: light.id,
      title: 'Sphere and Cube — 5 Lighting Setups',
      description: 'Draw a sphere and cube together under 5 different lighting conditions: top light, side light, backlight, under-light, and ambient only. Use graphite or digital grayscale.',
      difficulty: 'beginner',
      estimatedMinutes: 60,
      specificGoals: [
        { goal: 'Complete all 5 lighting setups for both objects', measurable: true },
        { goal: 'Show form shadow, core shadow, reflected light, and cast shadow', measurable: true },
        { goal: 'Label each lighting type', measurable: true },
      ],
      tags: ['light', 'shadow', 'fundamentals', 'form'],
      isPublished: true,
    },
    {
      skillCategoryId: light.id,
      title: 'Portrait Lighting Study — Rembrandt Pattern',
      description: 'Study and render a portrait using the classic Rembrandt lighting pattern. Identify the shadow patterns and accurately render the transition from light to shadow.',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      specificGoals: [
        { goal: 'Correctly identify and place the Rembrandt triangle', measurable: true },
        { goal: 'Show a soft transition between light and shadow zones', measurable: true },
        { goal: 'Render reflected light on the shadow side', measurable: true },
      ],
      tags: ['light', 'portrait', 'rembrandt'],
      isPublished: true,
    },
    {
      skillCategoryId: light.id,
      title: 'Night Scene with Multiple Light Sources',
      description: 'Paint or draw an outdoor night scene with at least 3 competing light sources (streetlamp, neon sign, moonlight). Each source must produce distinct colored shadows and highlights.',
      difficulty: 'advanced',
      estimatedMinutes: 180,
      specificGoals: [
        { goal: 'Include exactly 3+ clearly distinct light sources', measurable: true },
        { goal: 'Each light source produces different colored light', measurable: true },
        { goal: 'Shadows are colored (not just black) based on surrounding light', measurable: true },
      ],
      tags: ['light', 'night-scene', 'color', 'advanced'],
      isPublished: true,
    },
    // Gesture
    {
      skillCategoryId: gesture.id,
      title: '30-Second Gesture Warmup — 20 Poses',
      description: 'Using a timed gesture reference site (e.g., Line of Action), draw 20 poses at 30 seconds each. Focus on capturing the line of action, weight, and primary direction — not details.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      specificGoals: [
        { goal: 'Complete exactly 20 gesture drawings', measurable: true },
        { goal: 'Draw a clear line of action through each figure', measurable: true },
        { goal: 'Keep each drawing to 30 seconds maximum', measurable: true },
      ],
      tags: ['gesture', 'warmup', 'figure', 'speed'],
      isPublished: true,
    },
    {
      skillCategoryId: gesture.id,
      title: 'Exaggerated Action Pose Sequence',
      description: 'Pick a physical activity (jumping, throwing, running) and draw a 3-frame sequence of the action with strong exaggeration. Push the arc of motion and weight shift.',
      difficulty: 'intermediate',
      estimatedMinutes: 60,
      specificGoals: [
        { goal: 'Draw a 3-frame sequence of a clear physical action', measurable: true },
        { goal: 'Exaggerate the motion arc beyond realistic proportions', measurable: true },
        { goal: 'Show clear weight shift between frames', measurable: true },
      ],
      tags: ['gesture', 'action', 'exaggeration', 'sequence'],
      isPublished: true,
    },
    {
      skillCategoryId: gesture.id,
      title: 'Clothed Figure — Fabric Follow Through',
      description: 'Draw a clothed figure in dynamic motion. Study how fabric follows and lags behind movement — sleeves, coattails, scarves. The clothing must read the gesture.',
      difficulty: 'advanced',
      estimatedMinutes: 90,
      specificGoals: [
        { goal: 'The fabric clearly reinforces the direction of motion', measurable: true },
        { goal: 'Include at least one fabric element with clear follow-through (scarf, cape, hair)', measurable: true },
        { goal: 'The figure underneath is structurally sound (not hidden by fabric)', measurable: true },
      ],
      tags: ['gesture', 'fabric', 'figure', 'advanced'],
      isPublished: true,
    },
  ] as Partial<ExerciseEntity>[]);

  console.log('✅ Seeded 6 skill categories and 18 exercises.');
}
