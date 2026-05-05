import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const user = await db.user.upsert({
    where: { email: "demo@projectflow.com" },
    update: {},
    create: { email:"demo@projectflow.com", name:"Alex Chen", avatarUrl:"https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  });
  const org = await db.organization.upsert({
    where: { slug: "projectflow-hq" },
    update: {},
    create: { name:"ProjectFlow HQ", slug:"projectflow-hq", members:{ create:{ userId:user.id, role:"OWNER" } } },
  });
  const project = await db.project.create({
    data: { orgId:org.id, name:"Website Redesign", description:"Redesign company website", color:"#3a7bff", createdById:user.id },
  });
  const tasks = [
    { title:"Design new landing page",  status:"IN_PROGRESS" as const, priority:"HIGH" as const },
    { title:"Set up Next.js project",   status:"DONE"        as const, priority:"URGENT" as const },
    { title:"Implement auth flow",      status:"TODO"        as const, priority:"HIGH" as const },
    { title:"Build dashboard UI",       status:"TODO"        as const, priority:"MEDIUM" as const },
    { title:"Write API documentation",  status:"TODO"        as const, priority:"LOW" as const },
  ];
  for (let i = 0; i < tasks.length; i++) {
    await db.task.create({ data:{ ...tasks[i], projectId:project.id, createdById:user.id, assigneeId:user.id, position:i*1000, dueDate:new Date(Date.now()+(i+1)*86400000*3) } });
  }
  console.log("Seed complete!");
}
main().catch(console.error).finally(()=>db.$disconnect());
