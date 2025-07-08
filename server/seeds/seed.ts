import mongoose, { Document, Types } from 'mongoose';
import { ArticleSchema } from '../src/articles/schemas/article.schema';
import { ProjectSchema } from '../src/projects/schemas/project.schema';
import { EventSchema } from '../src/events/schemas/event.schema';
import { LibraryFileSchema } from '../src/library/schemas/library-file.schema';
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { Prop, Schema } from '@nestjs/mongoose';

config(); // Loads .env if present

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/anarchy-codex';

// User schema for seeding
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const articlesList = [
  {
    title: 'The Rise of Anarcho-Individualism',
    summary: 'Understanding the principles of Anarcho-Individualism.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-09T21:00:00.000Z'),
    createdAt: new Date('2025-07-09T21:00:00.000Z'),
    updatedAt: new Date('2025-07-09T21:00:00.000Z'),
  },
  {
    title: 'Libertarian Ethics in Modern Society',
    summary: "How libertarian ethics apply to today's world.",
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-07T21:00:00.000Z'),
    createdAt: new Date('2025-07-07T21:00:00.000Z'),
    updatedAt: new Date('2025-07-07T21:00:00.000Z'),
  },
  {
    title: 'Decentralization and Personal Freedom',
    summary: 'The impact of decentralization on personal autonomy.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-06T21:00:00.000Z'),
    createdAt: new Date('2025-07-06T21:00:00.000Z'),
    updatedAt: new Date('2025-07-06T21:00:00.000Z'),
  },
  {
    title: 'The Individual and the State',
    summary: 'Exploring autonomy against state power.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-06T21:00:00.000Z'),
    createdAt: new Date('2025-07-06T21:00:00.000Z'),
    updatedAt: new Date('2025-07-06T21:00:00.000Z'),
  },
  {
    title: 'Agorism in Practice',
    summary: 'Counter-economic strategies for a stateless city.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'The Ethics of Voluntaryism',
    summary: 'A deep dive into voluntary ethics and personal sovereignty.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Decentralized Technology',
    summary: 'How blockchain and peer-to-peer networks empower freedom.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Libertarianism and the Environment',
    summary: 'Environmental stewardship through voluntary action.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Anarcho-Capitalism Explained',
    summary: 'Understanding the principles of Anarcho-Capitalism.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'The Role of the Individual',
    summary: 'The importance of individual action in societal change.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
];

const projectsList = [
  {
    title: 'Decentralized Market Platform',
    description: 'Aiming to create a P2P marketplace.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Anarchist Literature Translation',
    description: 'Focus on classical anarchist texts.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Community Education Workshops',
    description: 'Workshops on Anarcho-Individualism and Libertarianism.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
  {
    title: 'Open Source Tools for Freedom',
    description: 'Developing tools to enhance personal freedom.',
    tags: [],
    isPublished: true,
    viewCount: 0,
    publishedAt: new Date('2025-07-04T21:00:00.000Z'),
    createdAt: new Date('2025-07-04T21:00:00.000Z'),
    updatedAt: new Date('2025-07-04T21:00:00.000Z'),
  },
];

const eventsList = [
  {
    title: 'Libertarian Meetup',
    description: 'Connecting liberty advocates in local communities.',
    startDate: new Date('2025-07-25T18:00:00.000Z'),
    endDate: new Date('2025-07-25T20:00:00.000Z'),
    location: 'Local Park',
    url: '/events/libertarian-meetup',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Ethics of Anarchy',
    description: 'Online discussion on moral principles of anarchism.',
    startDate: new Date('2025-07-25T18:00:00.000Z'),
    endDate: new Date('2025-07-25T20:00:00.000Z'),
    location: 'Online',
    url: '/events/ethics-of-anarchy',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Anarcho-Capitalism Conference',
    description:
      'A conference for discussing Anarcho-Capitalist ideas and strategies.',
    startDate: new Date('2025-07-15T09:00:00.000Z'),
    endDate: new Date('2025-07-15T17:00:00.000Z'),
    location: 'Virtual Event',
    url: '/events/anarcho-capitalism-conference',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title:
      'Libertarian Book Club - Monthly Discussion on Libertarian Literature',
    description:
      'Join us for our monthly book club where we discuss a selected libertarian book.',
    startDate: new Date('2025-07-20T18:00:00.000Z'),
    endDate: new Date('2025-07-20T20:00:00.000Z'),
    location: 'Online',
    url: '/events/libertarian-book-club',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Decentralization Meetup',
    description: 'A gathering to discuss decentralization strategies.',
    startDate: new Date('2025-07-01T18:00:00.000Z'),
    endDate: new Date('2025-07-01T20:00:00.000Z'),
    location: 'Local Community Center',
    url: '/events/decentralization-meetup',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Freedom Festival',
    description:
      'Celebrating freedom with talks, workshops, and music from local artists.',
    startDate: new Date('2025-07-15T10:00:00.000Z'),
    endDate: new Date('2025-07-15T22:00:00.000Z'),
    location: 'City Square',
    url: '/events/freedom-festival',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title:
      'Anarchist Art Exhibition - Showcasing Art that Promotes Anarchist Themes',
    description:
      'An exhibition featuring art that explores and promotes anarchist themes and ideas.',
    startDate: new Date('2025-07-10T10:00:00.000Z'),
    endDate: new Date('2025-07-10T18:00:00.000Z'),
    location: 'Local Gallery',
    url: '/events/anarchist-art-exhibition',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Agorist Market Day - A Market Day for Counter-Economic Activities',
    description:
      'Join us for a market day focused on counter-economic activities, featuring local vendors and community members.',
    startDate: new Date('2025-07-05T10:00:00.000Z'),
    endDate: new Date('2025-07-05T16:00:00.000Z'),
    location: 'Community Park',
    url: '/events/agorist-market-day',
    isPublic: true,
    attendeeCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
];

const booksList = [
  {
    title: 'The Ego and Its Own',
    description:
      'A foundational text of individualist anarchism, exploring the nature of the self and the rejection of all forms of authority.',
    filename: 'the-ego-and-its-own.pdf',
    originalName: 'The Ego and Its Own.pdf',
    author: 'Max Stirner',
    mimeType: 'application/pdf',
    size: 1024000, // 1MB
    tags: ['anarchism', 'individualism'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Anarcho-Capitalism: A Primer',
    description:
      'An introduction to the principles of Anarcho-Capitalism, advocating for a stateless society based on voluntary trade and private property.',
    filename: 'anarcho-capitalism-primer.pdf',
    originalName: 'Anarcho-Capitalism Primer.pdf',
    author: 'Murray Rothbard',
    mimeType: 'application/pdf',
    size: 2048000, // 2MB
    tags: ['anarcho-capitalism', 'libertarianism'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'The Ethics of Liberty',
    description:
      'A comprehensive exploration of libertarian ethics, arguing for a society based on natural rights and voluntary cooperation.',
    filename: 'ethics-of-liberty.pdf',
    originalName: 'Ethics of Liberty.pdf',
    author: 'Murray Rothbard',
    mimeType: 'application/pdf',
    size: 1536000, // 1.5MB
    tags: ['libertarianism', 'ethics'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'For a New Liberty',
    description:
      'A classic work advocating for a free society based on individual liberty, private property, and voluntary cooperation.',
    filename: 'for-a-new-liberty.pdf',
    originalName: 'For a New Liberty.pdf',
    author: 'Murray Rothbard',
    mimeType: 'application/pdf',
    size: 2560000, // 2.5MB
    tags: ['libertarianism', 'freedom'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Anarchy, State, and Utopia',
    description:
      'A philosophical exploration of the nature of the state, individual rights, and the concept of a just society.',
    filename: 'anarchy-state-utopia.pdf',
    originalName: 'Anarchy State Utopia.pdf',
    author: 'Murray Rothbard',
    mimeType: 'application/pdf',
    size: 3072000, // 3MB
    tags: ['philosophy', 'political theory'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Libertarianism: A Primer',
    description:
      'An accessible introduction to libertarian principles, covering topics such as individual rights, free markets, and limited government.',
    filename: 'libertarianism-primer.pdf',
    originalName: 'Libertarianism Primer.pdf',
    author: 'David Boaz',
    mimeType: 'application/pdf',
    size: 2048000, // 2MB
    tags: ['libertarianism', 'political theory'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'The Anarchist Cookbook',
    description:
      'A controversial book that discusses various aspects of anarchism, including tactics and strategies for resisting authority.',
    filename: 'anarchist-cookbook.pdf',
    originalName: 'Anarchist Cookbook.pdf',
    author: 'William Powell',
    mimeType: 'application/pdf',
    size: 5120000, // 5MB
    tags: ['anarchism', 'resistance'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'Anarchism: A Very Short Introduction',
    description:
      'A concise overview of anarchist thought, its history, and its relevance in contemporary society.',
    filename: 'anarchism-very-short-introduction.pdf',
    originalName: 'Anarchism Very Short Introduction.pdf',
    author: 'Colin Ward',
    mimeType: 'application/pdf',
    size: 1536000, // 1.5MB
    tags: ['anarchism', 'history'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'The Market for Liberty',
    description:
      'An exploration of how a free market can provide for all societal needs without the interference of the state.',
    filename: 'market-for-liberty.pdf',
    originalName: 'Market for Liberty.pdf',
    author: 'Murray Rothbard and Linda C. Raeder',
    mimeType: 'application/pdf',
    size: 2048000, // 2MB
    tags: ['libertarianism', 'free market'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
  {
    title: 'The Ethics of Anarchism',
    description:
      'A philosophical exploration of the ethical foundations of anarchist thought and its implications for society.',
    filename: 'ethics-of-anarchism.pdf',
    originalName: 'Ethics of Anarchism.pdf',
    author: 'Robert Paul Wolff',
    mimeType: 'application/pdf',
    size: 2560000, // 2.5MB
    tags: ['anarchism', 'ethics'],
    language: 'English',
    format: 'PDF',
    isPublic: true,
    downloadCount: 0,
    viewCount: 0,
    createdAt: new Date('2025-07-01T21:00:00.000Z'),
    updatedAt: new Date('2025-07-01T21:00:00.000Z'),
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const User = mongoose.model('User', UserSchema);
    const Article = mongoose.model('Article', ArticleSchema);
    const Project = mongoose.model('Project', ProjectSchema);
    const Event = mongoose.model('Event', EventSchema);
    const Book = mongoose.model('LibraryFile', LibraryFileSchema);

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Article.deleteMany({});

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'admin@anarchy-codex.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });

    const AUTHOR_ID = user._id.toString();
    console.log(`Created admin user with ID: ${AUTHOR_ID}`);

    console.log('Seeding articles, projects and events...');
    const updatedArticlesList = articlesList.map((article) => ({
      ...article,
      author: AUTHOR_ID,
    }));
    const updatedProjectsList = projectsList.map((project) => ({
      ...project,
      author: AUTHOR_ID,
    }));
    const updatedEventsList = eventsList.map((event) => ({
      ...event,
      organizer: AUTHOR_ID,
    }));

    await Article.insertMany(updatedArticlesList);
    console.log(`Seeded ${updatedArticlesList.length} articles`);

    await Project.insertMany(updatedProjectsList);
    console.log(`Seeded ${updatedProjectsList.length} projects`);

    await Event.insertMany(updatedEventsList);
    console.log(`Seeded ${updatedEventsList.length} events`);

    await Book.insertMany(booksList);
    console.log(`Seeded ${booksList.length} books`);

    console.log('Database seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
