"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    console.log("crear evento");
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.events.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.events.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  async update(ctx) {
    const { id } = ctx.params;
    let entity;
    const [event] = await strapi.services.events.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });
    if (!event) {
      return ctx.unauthorized(`You can't update this entry`);
    }
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.events.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.events.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  async delete(ctx) {
    const { id } = ctx.params;
    console.log(id);
    const [events] = await strapi.services.events.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });
    console.log(events);
    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }
    const entity = await strapi.services.events.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No Authorization header was found" }] },
      ]);
    }
    const data = await strapi.services.events.find({ user: user.id });
    if (!data) {
      return ctx.notFound();
    }
    return sanitizeEntity(data, { model: strapi.models.events });
  },
};
