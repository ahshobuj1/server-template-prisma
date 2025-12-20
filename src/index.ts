import express from 'express';
import 'dotenv/config';
import {Prisma} from '../prisma/generated/client';
import {prisma} from './lib';

const app = express();

app.use(express.json());

app.post(`/signup`, async (req, res) => {
  const {name, email, posts} = req.body;

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return {title: post?.title, content: post?.content};
  });

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  });
  res.json(result);
});

// app.post(`/post`, async (req, res) => {
//   const {title, content, authorEmail} = req.body;
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: {connect: {email: authorEmail}},
//     },
//   });
//   res.json(result);
// });

app.put('/post/:id/views', async (req, res) => {
  const {id} = req.params;

  try {
    const post = await prisma.post.update({
      where: {id: Number(id)},
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`});
  }
});

app.put('/publish/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: {id: Number(id)},
      select: {
        published: true,
      },
    });

    const updatedPost = await prisma.post.update({
      where: {id: Number(id) || undefined},
      data: {published: !postData?.published},
    });
    res.json(updatedPost);
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`});
  }
});

app.delete(`/post/:id`, async (req, res) => {
  const {id} = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findUniqueOrThrow({
    where: {id: 2},
    select: {
      email: true,
      name: false,
      id: true,
    },
  });
  console.log(users);
  res.json(users);
});

app.get('/user/:id/drafts', async (req, res) => {
  const {id} = req.params;

  const drafts = await prisma.post.findMany({
    where: {
      userId: Number(id),
      published: false,
    },
  });

  res.json(drafts);
});

app.get(`/post/:id`, async (req, res) => {
  const {id}: {id?: string} = req.params;

  const post = await prisma.post.findUnique({
    where: {id: Number(id)},
  });
  res.json(post);
});

app.get('/feed', async (req, res) => {
  const {searchString, skip, take, orderBy} = req.query;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          {title: {contains: searchString as string}},
          {content: {contains: searchString as string}},
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: {user: true},
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });

  res.json(posts);
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findUniqueOrThrow({
    where: {id: 2},
    select: {
      email: true,
      name: false,
      id: true,
    },
  });
  console.log(users);
  res.json(users);
});

app.get(`/posts`, async (req, res) => {
  // const {title, content, authorEmail} = req.body;

  const result = await prisma.testModel.createManyAndReturn({
    data: [
      {
        name: 'Firsfggt Pdscxcost',
        value: 423,
      },
      {
        name: 'Firsfgfgt Podsfsdst',
        value: 422,
      },
      {
        name: 'Firfgbfst Post32er',
        value: 43,
      },
      {
        name: 'Firsfggfgt Pdscxcost',
        value: 423,
      },
      {
        name: 'Firstfgg Podsfsdst',
        value: 422,
      },
      {
        name: 'Firfgfggffst Post32er',
        value: 43,
      },
      {
        name: 'Firfgfst Pdscxcost',
        value: 423,
      },
      {
        name: 'Firstgf ggfPodsfsdst',
        value: 422,
      },
      {
        name: 'First Pogfgffdgst32er',
        value: 43,
      },
      {
        name: 'First Pdsgffgchfghfgbhxcost',
        value: 423,
      },
      {
        name: 'First Podsfgfhfghsdst',
        value: 422,
      },
      {
        name: 'First Posfghfft32er',
        value: 43,
      },
    ],
  });

  console.log(result);

  res.json(result);
});

app.get('/testModel', async (req, res) => {
  // Get, Filter, Sort , Pagination
  const users = await prisma.testModel.findMany({
    where: {
      OR: [
        {
          name: {
            startsWith: 'First Poswsdwedwedwet',
          },
        },
        {
          AND: {
            id: {
              lt: 30,
            },
          },
        },
      ],
    },
    orderBy: {
      id: 'desc',
    },
    select: {
      id: true,
      name: true,
    },

    skip: 10, // Offset pagination
    take: 10, // Offset pagination
    cursor: {
      // for pagination cursor
      id: 15,
    },
  });

  // const users = await prisma.testModel.findFirst({
  //   where: {
  //     id: {
  //       gt: 15,
  //     },
  //   },
  // });

  const result = {
    total: users.length,
    users,
  };

  console.log(result);

  res.json(result);
});

app.get('/testModels', async (req, res) => {
  const users = await prisma.testModel.findMany({
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  });

  const result = {
    total: users.length,
    users,
  };

  console.log(result);

  res.json(result);
});

app.get('/testModelUpdate', async (req, res) => {
  const result = await prisma.testModel.upsert({
    where: {
      id: 1222,
    },
    update: {
      name: 'Updated Name  for First Postasadasdasdasdasdasdswadasdasdasdas ',
    },
    create: {
      name: 'First Postttttttttttttttttttttttt',
      value: 100,
    },
  });

  console.log(result);

  res.json(result);
});

app.get('/testModelDelete', async (req, res) => {
  const result = await prisma.testModel.deleteMany({
    where: {
      name: {
        contains: 'First Pods',
      },
    },
  });

  console.log(result);

  res.json(result);
});

app.get('/test', async (req, res) => {
  const result = await prisma.user.findUnique({
    where: {id: 1},
    include: {
      _count: {
        select: {posts: true},
      },
    },
  });

  // const result = {
  //   // total: users.length,
  //   users,
  // };

  console.log(result);

  res.json(result);
});

app.get('/test1', async (req, res) => {
  const result = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // const result = {
  //   // total: users.length,
  //   users,
  // };

  console.log(result);

  res.json(result);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
