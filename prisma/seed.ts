import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample data...');

  // Clear existing data
  await prisma.blogPost.deleteMany();
  await prisma.upcomingClass.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  // Create sample blog posts
  const posts = [
    {
      slug: 'kubernetes-101-guide',
      title: 'Kubernetes 101: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of Kubernetes container orchestration',
      content: `<h2>Getting Started with Kubernetes</h2>
<p>Kubernetes has become the standard for container orchestration. In this guide, we'll explore the basics.</p>
<h3>What is Kubernetes?</h3>
<p>Kubernetes is an open-source platform that automates deployment, scaling, and operations of containerized applications.</p>
<h3>Key Components</h3>
<p>Pods, Services, Deployments, and StatefulSets are the building blocks of Kubernetes.</p>`,
      category: 'Kubernetes',
      difficulty: 'beginner',
      tags: 'kubernetes,containers,devops',
      featured: true,
      published: true,
      readingTime: 8,
    },
    {
      slug: 'aws-to-azure-migration',
      title: 'Migrating from AWS to Azure: A Step-by-Step Guide',
      excerpt: 'Complete guide to migrating your infrastructure from AWS to Azure',
      content: `<h2>Cloud Migration Strategy</h2>
<p>Migrating to the cloud is a significant decision. Here's how to do it right.</p>
<h3>Assessment Phase</h3>
<p>Start by assessing your current infrastructure and identifying dependencies.</p>
<h3>Planning</h3>
<p>Create a detailed migration plan with timelines and resource allocation.</p>`,
      category: 'Cloud Architecture',
      difficulty: 'advanced',
      tags: 'aws,azure,migration,cloud',
      featured: true,
      published: true,
      readingTime: 15,
    },
    {
      slug: 'docker-best-practices',
      title: 'Docker Best Practices 2024',
      excerpt: 'Essential Docker practices for production environments',
      content: `<h2>Writing Production-Ready Dockerfiles</h2>
<p>Docker is essential for modern application deployment.</p>
<h3>Image Optimization</h3>
<p>Keep your images small and efficient.</p>
<h3>Security</h3>
<p>Never run containers as root and scan for vulnerabilities.</p>`,
      category: 'DevOps',
      difficulty: 'intermediate',
      tags: 'docker,containerization,devops,best-practices',
      featured: false,
      published: true,
      readingTime: 10,
    },
    {
      slug: 'terraform-infrastructure-as-code',
      title: 'Mastering Terraform: IaC for Cloud Infrastructure',
      excerpt: 'Infrastructure as Code with Terraform for scalable deployments',
      content: `<h2>Infrastructure as Code Revolution</h2>
<p>Terraform enables you to codify your infrastructure.</p>
<h3>State Management</h3>
<p>Understanding Terraform state is crucial for team collaboration.</p>
<h3>Best Practices</h3>
<p>Use modules, remote state, and version control for your IaC.</p>`,
      category: 'Infrastructure',
      difficulty: 'intermediate',
      tags: 'terraform,iac,infrastructure,devops',
      featured: false,
      published: true,
      readingTime: 12,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        ...post,
        publishedAt: new Date(),
      },
    });
    console.log(`✓ Created blog post: ${post.title}`);
  }

  // Create sample upcoming classes
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  const endDate = new Date(futureDate);
  endDate.setHours(endDate.getHours() + 4);

  const classes = [
    {
      title: 'Kubernetes Fundamentals Workshop',
      description: 'Hands-on workshop covering Kubernetes basics, deployment strategies, and production considerations.',
      category: 'Kubernetes',
      startDate: futureDate,
      endDate,
      duration: 4,
      instructor: 'John Smith',
      location: 'Virtual (Zoom)',
      capacity: 30,
      price: 99,
      isPaid: true,
      published: true,
    },
    {
      title: 'Free DevOps Fundamentals Webinar',
      description: 'Introduction to DevOps practices, CI/CD pipelines, and automation tools.',
      category: 'DevOps',
      startDate: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      duration: 2,
      instructor: 'Sarah Johnson',
      location: 'Virtual (Zoom)',
      capacity: 100,
      price: 0,
      isPaid: false,
      published: true,
    },
    {
      title: 'Cloud Architecture Design Masterclass',
      description: 'Learn how to architect scalable, secure, and cost-effective cloud solutions.',
      category: 'Cloud Architecture',
      startDate: new Date(futureDate.getTime() + 21 * 24 * 60 * 60 * 1000),
      endDate: new Date(futureDate.getTime() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      duration: 6,
      instructor: 'Michael Chen',
      location: 'Virtual (Zoom)',
      capacity: 25,
      price: 199,
      isPaid: true,
      published: true,
    },
  ];

  for (const cls of classes) {
    await prisma.upcomingClass.create({
      data: cls,
    });
    console.log(`✓ Created class: ${cls.title}`);
  }

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
