import { PrismaClient, UserRole, InvitationStatus } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 1. Organizer
  const organizer = await prisma.user.upsert({
    where: { email: 'organizator@email.com' },
    update: {},
    create: {
      role: UserRole.ORGANIZER,
      name: 'Ana Organizator',
      email: 'organizator@email.com',
      emailVerifiedAt: new Date(),
      passwordHash: await hash('Geslo123!')
    },
  });

  // 2. Event
  const event = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      name: 'Letni piknik',
      date: new Date('2025-06-21'),
      time: '15:00',
      location: 'Park Tivoli, Ljubljana',
      description: 'Sproščeno druženje s spremljavo.',
      rsvpDeadline: new Date('2025-06-15T23:59:00Z'),
    },
  });

  // 3. Invitations and RSVPs
  const invitees = [
    { name: 'Jure Gost', email: 'jure@example.com' },
    { name: 'Maja Gostja', email: 'maja@example.com' },
    { name: 'Nejc Prijatelj', email: 'nejc@example.com' },
    { name: 'Ročna Gostja', email: '', status: 'MANUAL' as InvitationStatus },
  ];

  for (const invite of invitees) {
    const invitation = await prisma.invitation.create({
      data: {
        eventId: event.id,
        email: invite.email || 'manual@example.com',
        name: invite.name,
        status: invite.status || InvitationStatus.SENT,
        token: Math.random().toString(36).slice(2, 15),
        sentAt: new Date(),
      },
    });
    // Some RSVPs
    if (invite.email === 'jure@example.com') {
      await prisma.rSVP.create({
        data: {
          invitationId: invitation.id,
          attending: true,
          companions: 2,
          dietary: 'vegetarijansko',
          personalNote: 'Pridem kasneje!'
        },
      });
    }
    if (invite.email === 'maja@example.com') {
      await prisma.rSVP.create({
        data: {
          invitationId: invitation.id,
          attending: false,
          companions: 0,
        },
      });
    }
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
