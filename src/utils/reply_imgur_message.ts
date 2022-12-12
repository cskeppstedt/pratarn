import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  Embed,
} from "discord.js";
import { IImgurGalleryImage } from "../types";
import {
  ISubredditGalleryOptions,
  ISubredditGalleryOptionsInput,
  isValidOptionsInput,
  randomGalleryImage,
} from "./imgur";

export const REE_BUTTON_ID = "reply_imgur_message_ree";

export const commandDescription = ({
  subreddit,
  window,
  sort,
}: ISubredditGalleryOptionsInput) =>
  `links a random r/${subreddit} image from this ${window}, sorted by ${sort}`;

export const formatImgurMessage = (
  options: ISubredditGalleryOptions,
  image: IImgurGalleryImage
) => {
  return `${options.sort}[${options.window}] from r/${options.subreddit} - ${image.link}`;
};

const makeButton = (): [ActionRowBuilder<ButtonBuilder>] | undefined => {
  const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(REE_BUTTON_ID)
      .setLabel("ree")
      .setStyle(ButtonStyle.Primary)
  );
  return [button];
};

const findFieldValue = (embed: Embed, fieldName: string) =>
  embed.fields.find((field) => field.name === fieldName)?.value;

const parseOptionsInput = (
  embeds: Embed[]
): ISubredditGalleryOptionsInput | undefined => {
  for (const embed of embeds) {
    const values: Partial<ISubredditGalleryOptionsInput> = {
      subreddit: findFieldValue(embed, "subreddit"),
      sort: findFieldValue(embed, "sort") as any,
      window: findFieldValue(embed, "window") as any,
    };
    if (isValidOptionsInput(values)) {
      return values;
    }
  }
};

const getMessageContent = async (
  optionsInput: ISubredditGalleryOptionsInput
) => {
  const { image, options } = await randomGalleryImage(optionsInput);
  return {
    embeds: [
      {
        title: image.title,
        image: { url: image.link },
        fields: [
          { name: "subreddit", value: options.subreddit, inline: true },
          { name: "sort", value: options.sort, inline: true },
          { name: "window", value: options.window, inline: true },
        ],
      },
    ],
    components: makeButton(),
  };
};

export const updateMessageRee = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();

  const message = interaction.message.partial
    ? await interaction.message.fetch()
    : interaction.message;

  const optionsInput = parseOptionsInput(message.embeds);

  if (optionsInput) {
    const messageContent = await getMessageContent(optionsInput);
    return interaction.editReply(messageContent);
  }
};

export const replyCommandInteractionEmbed = async (
  optionsInput: ISubredditGalleryOptionsInput,
  interaction: CommandInteraction
) => {
  if (!interaction.isRepliable()) {
    return;
  }

  await interaction.deferReply();
  const messageContent = await getMessageContent(optionsInput);
  return interaction.editReply(messageContent);
};

export const replyCommandInteraction = async (
  optionsInput: ISubredditGalleryOptionsInput,
  interaction: CommandInteraction
) => {
  // TODO: remove
  if (interaction.user.username === "skepparn") {
    return replyCommandInteractionEmbed(optionsInput, interaction);
  }

  if (interaction.isRepliable()) {
    await interaction.deferReply();
    const { image, options } = await randomGalleryImage(optionsInput);
    const content = formatImgurMessage(options, image);
    return interaction.editReply({ content });
  }
};
