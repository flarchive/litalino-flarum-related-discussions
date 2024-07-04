import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import PostStream from 'flarum/forum/components/PostStream';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import avatar from 'flarum/common/helpers/avatar';
import Link from 'flarum/common/components/Link';
import tagsLabel from 'flarum/tags/helpers/tagsLabel';
import Separator from 'flarum/common/components/Separator';
import Tooltip from 'flarum/common/components/Tooltip';
import username from 'flarum/common/helpers/username';

app.initializers.add('litalino/related-discussions', () => {
  extend(PostStream.prototype, 'oncreate', function () {
    const discTitle = this.attrs.discussion;
    const limitRelated = app.forum.attribute('litalino-related-discussions.relatedLimit') || 4;
    const elem = document.getElementById('listRel');

    let relDisc = app.store
      .find('discussions', {
        page: { limit: limitRelated + 1 },
        'filter[q]': discTitle.data.attributes.title,
      })
      .then((results) => {
        this.relDiscussion = results;

        const RelatedComp = () => {
          const DisplayRelated = this.relDiscussion.splice(1, limitRelated);
          const showTooltip = app.forum.attribute('litalino-related-discussions.showTooltip');

          return {
            view: () => (
              <div className="wraprelated">
                <h2 className="DiscussionListItem-title-related">
                  <i className="fas fa-indent relatedTitle" />
                  {app.forum.attribute('litalino-related-discussions.relatedTitle') ||
                    app.translator.trans('litalino-related-discussions.forum.reldiscussion')}
                </h2>
                <div className="DiscussionList related-discussions" role="navigation">
                  {DisplayRelated.map((relDisc) => {
                    const createdAtDate = relDisc.data?.attributes?.createdAt.slice(0,10)
                    //console.log(relDisc)
                    const bestAnswer = {
                      view: function (vnode) {
                        if (relDisc.data.attributes.hasBestAnswer !== false && relDisc.data.attributes.hasBestAnswer !== undefined) {
                          return m(
                            'span',
                            {
                              classname: 'has-best-answer',
                              id: 'has-best-answer',
                              title: app.translator.trans('litalino-related-discussions.forum.hasBestAnswer-title'),
                            },
                            app.translator.trans('litalino-related-discussions.forum.hasBestAnswer')
                          );
                        }
                      },
                    };
                    return (
                      <div class="DiscussionListItem">
                        <div className="DiscussionListItem-content Slidable-content read related">
                          <Link 
                            className="DiscussionListItem-author"
                            href={`${app.forum.attribute('baseUrl')}/u/${relDisc.user().data?.attributes?.username}`}>
                            <Tooltip 
                              text={`${relDisc.user().data?.attributes?.username} ${app.translator.trans('litalino-related-discussions.forum.avatarTooltip')} ${createdAtDate}`}>
                              {avatar(relDisc.user(), {
                                title: relDisc.user().data?.attributes?.username,
                                className: 'DiscussionListItem-thumbnail relatedAvatar',
                              })}
                            </Tooltip>
                          </Link>
                          {showTooltip === true ? (
                            <Tooltip
                              className="tooltip-related"
                              text={
                                relDisc
                                  .firstPost()
                                  .contentHtml()
                                  .replace(/<\/?[^>]+(>|$)/g, '')
                                  .substr(0, 200) + '...'
                              }
                            >
                              <Link className="DiscussionListItem-main related" title={relDisc.title()} href={app.route.discussion(relDisc)}>
                                <h3 className="DiscussionListItem-title related">
                                  {relDisc.title()} {m(bestAnswer)}
                                </h3>
                                <ul className="DiscussionListItem-info related">
                                  <li className="item-terminalPost">
                                    <span>
                                      <i aria-hidden="true" className="icon fas fa-reply" />{' '}
                                      <span className="username">{username(relDisc.lastPostedUser())}</span>
                                      <span className="replied-on">{app.translator.trans('litalino-related-discussions.forum.repliedOn')} </span>
                                      <time dateTime={relDisc.data.attributes.lastPostedAt}>
                                        {app.translator.trans('litalino-related-discussions.forum.postedOn')}{' '}
                                        {relDisc.data.attributes.lastPostedAt.slice(0, 10)}
                                      </time>
                                    </span>
                                  </li>
                                </ul>
                              </Link>
                            </Tooltip>
                          ) : (
                            <Link className="DiscussionListItem-main related" title={relDisc.title()} href={app.route.discussion(relDisc)}>
                              <h3 className="DiscussionListItem-title related">
                                {relDisc.title()} {m(bestAnswer)}
                              </h3>
                              <ul className="DiscussionListItem-info related">
                                <li className="item-terminalPost">
                                  <span>
                                    <i aria-hidden="true" className="icon fas fa-reply" />{' '}
                                    <span className="username">{username(relDisc.lastPostedUser())}</span>
                                    <span className="replied-on">{app.translator.trans('litalino-related-discussions.forum.repliedOn')} </span>
                                    <time dateTime={relDisc.data.attributes.lastPostedAt}>
                                      {app.translator.trans('litalino-related-discussions.forum.postedOn')}{' '}
                                      {relDisc.data.attributes.lastPostedAt.slice(0, 10)}
                                    </time>
                                  </span>
                                </li>
                              </ul>
                            </Link>
                          )}
                          <span className="DiscussionListItem-count related">
                            {tagsLabel(relDisc.tags(), {
                              link: true,
                              className: 'related-tag',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="separator-related">
                  <Separator />
                </div>
              </div>
            ),
          };
        };
        m.mount(elem, RelatedComp);
      });
  });
  extend(PostStream.prototype, 'view', function (vdom) {
    if (app.forum.attribute('litalino-related-discussions.enable.DiscussionPageLayout') === false) {
      if (vdom.children && vdom.children.splice) {
        const insert = m('div', {
          key: 'litalino-relatedDisc',
          className: 'relatedList',
          id: 'listRel',
        });
        vdom.children.splice(1, 0, insert);
      }
    }
  });
  extend(DiscussionPage.prototype, 'view', function (vdom) {
    if (app.forum.attribute('litalino-related-discussions.enable.DiscussionPageLayout') === true) {
      if (vdom.children && vdom.children.splice) {
        const insert = m('div', {
          key: 'litalino-relatedDisc-DiscussionPage',
          className: 'container related',
          id: 'listRel',
        });
        vdom.children.splice(2, 0, insert);
      }
    }
  });
});
