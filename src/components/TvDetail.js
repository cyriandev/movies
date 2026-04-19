import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  RiArrowRightUpLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiClapperboardLine,
  RiImageLine,
  RiStarSFill,
  RiTv2Line,
} from 'react-icons/ri';
import TvContext from '../context/tv/tvContext';
import Cast from './Cast';
import Crew from './Crew';
import Review from './Review';
import Video, { sortVideosByPriority } from './Video';
import Reveal from './Reveal';
import Seo from './Seo';

const TABS = ['Seasons', 'Videos', 'Reviews', 'Cast', 'Crew'];

const renderTabCount = (tab, reviews, videos, seasons) => {
  if (tab === 'Reviews') {
    return reviews.length;
  }

  if (tab === 'Videos') {
    return videos.length;
  }

  if (tab === 'Seasons') {
    return seasons.length;
  }

  return null;
};

const TvDetail = () => {
  const { id } = useParams();
  const tvContext = useContext(TvContext);
  const {
    getTv, tv_loading, tv,
    getCast, cast_loading, credits,
    getReviews, reviews_loading, reviews,
    getVideos, videos_loading, videos,
  } = tvContext;

  const [activeTab, setActiveTab] = useState('Seasons');

  useEffect(() => {
    setActiveTab('Seasons');
    getTv(id);
    getCast(id);
    getReviews(id);
    getVideos(id);
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id]);

  if (tv_loading) {
    return (
      <div className="double-shell w-full">
        <div className="double-core flex h-[38rem] items-center justify-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const overview = tv.overview || 'No overview available for this series yet.';
  const seasons = tv.seasons || [];
  const genres = tv.genres || [];
  const castMembers = credits.cast?.slice(0, 12) || [];
  const crewMembers = credits.crew?.slice(0, 12) || [];
  const sortedVideos = sortVideosByPriority(videos);
  const featuredVideo = sortedVideos[0];
  const remainingVideos = sortedVideos.slice(1);

  const metadata = [
    {
      label: 'First aired',
      value: tv.first_air_date ? moment(tv.first_air_date).format('DD MMM YYYY') : 'TBA',
      icon: RiCalendarLine,
      compact: true,
    },
    {
      label: 'Seasons',
      value: tv.number_of_seasons || 0,
      icon: RiTv2Line,
    },
    {
      label: 'Rating',
      value: tv.vote_average ? tv.vote_average.toFixed(1) : 'N/A',
      icon: RiStarSFill,
      accent: true,
    },
    {
      label: 'Status',
      value: tv.status || 'Unknown',
      icon: RiClapperboardLine,
      compact: true,
    },
  ];

  const titleSlug = (tv.name || 'series').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="w-full space-y-6">
      <Seo title={`${tv?.name || 'TV Show'} - moviesntv`} description={overview} />

      <Reveal>
        <div className="double-shell">
          <div className="double-core relative overflow-hidden">
            <div className="absolute inset-0">
              {tv.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original/${tv.backdrop_path}`}
                  alt={tv.name}
                  className="h-full w-full object-cover object-center opacity-45"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,5,0.95)_0%,rgba(7,6,5,0.82)_38%,rgba(7,6,5,0.48)_72%,rgba(7,6,5,0.9)_100%)]" />
            </div>

            <div className="relative grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[15rem,1fr] lg:px-8 lg:py-8">
              <div className="double-shell max-w-[15rem]">
                <div className="double-core overflow-hidden">
                  {tv.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${tv.poster_path}`}
                      alt={tv.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                      <div className="flex aspect-[0.72] items-center justify-center text-[var(--accent)]">
                      <RiTv2Line size={52} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to="/tv"
                      className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-black/78 px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black/82"
                    >
                      <RiArrowLeftLine size={16} />
                      Back to series
                    </Link>

                  </div>

                  <h1 className="headline-gradient mt-4 text-[2.7rem] leading-[0.92] sm:text-[4rem]">
                    {tv.name}
                  </h1>

                  {tv.tagline && (
                    <p className="mt-3 text-base italic text-[#c9c1a1]">&ldquo;{tv.tagline}&rdquo;</p>
                  )}

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#9ca1b7]">
                    {overview}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-black/78 px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.18em] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid gap-2.5 lg:grid-cols-4">
          {metadata.map(({ label, value, icon: Icon, accent, compact }) => (
              <div key={label} className="double-shell">
                <div className="double-core stat-card h-full px-3.5 py-3.5">
                  <div className="stat-card-head">
                    <span className="stat-card-icon">
                      <Icon size={14} />
                    </span>
                    <p className="stat-card-label">{label}</p>
                  </div>
                <p className={`stat-card-value ${accent ? 'stat-card-value-accent' : ''} ${compact ? 'stat-card-value-compact' : ''}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="double-shell">
          <div className="double-core px-3.5 py-3.5 sm:px-4">
            <div className="flex justify-start">
              <div className="flex flex-wrap items-center gap-1.5 rounded-[0.85rem] bg-[#242526] p-1.5">
                {TABS.map((tab) => {
                  const count = renderTabCount(tab, reviews, videos, seasons);

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-pill ${activeTab === tab ? 'tab-pill-active' : ''}`}
                    >
                      {tab}
                      {count !== null ? ` (${count})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div>
        {activeTab === 'Cast' && (
          cast_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {castMembers.map((item) => (
                <Cast key={item.id} cast={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Crew' && (
          cast_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {crewMembers.map((item, index) => (
                <Crew key={`${item.credit_id || item.name}-${index}`} crew={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Reviews' && (
          reviews_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="double-shell">
              <div className="double-core px-6 py-14 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No reviews</p>
                <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">No written reviews are available yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((item) => (
                <Review key={item.id} item={item} />
              ))}
            </div>
          )
        )}

        {activeTab === 'Seasons' && (
          seasons.length === 0 ? (
            <div className="double-shell">
              <div className="double-core px-6 py-14 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No seasons</p>
                <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">Season data is not available for this series.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {seasons.map((season) => (
                <Link
                  key={season.id}
                  to={`/tv/${id}/${titleSlug}/season/${season.season_number}/${(season.name || `season-${season.season_number}`).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`}
                  className="group double-shell block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                >
                  <div className="double-core flex h-full gap-3 px-3.5 py-3.5">
                    <div className="aspect-[0.92] w-28 flex-shrink-0 self-start overflow-hidden rounded-[0.8rem] bg-[#242526]">
                      {season.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300/${season.poster_path}`}
                          alt={season.name}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                          <RiImageLine size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 gap-3">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div>
                          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">Season</p>
                          <div className="mt-2 flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <h3 className="text-[1.2rem] leading-[1.04] text-[#f5f6fb]">{season.name}</h3>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242526] px-2 py-1 text-[0.72rem] text-[#e7e1d7]">
                                <RiStarSFill className="text-[var(--accent)]" size={12} />
                                {season.vote_average != null ? Number(season.vote_average).toFixed(1) : 'N/A'}
                              </span>
                            </div>
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:bg-[rgba(36,37,38,0.5)]">
                              <RiArrowRightUpLine size={16} />
                            </span>
                          </div>
                          <p className="mt-2 text-[0.84rem] leading-6 text-[#9ca1b7]">
                            {season.air_date ? moment(season.air_date).format('MMMM YYYY') : 'TBA'} · {season.episode_count} episodes
                          </p>
                        </div>
                        <p className="mt-3 line-clamp-3 text-[0.84rem] leading-6 text-[#9ca1b7]">
                          {season.overview || 'No overview is available for this season yet.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {activeTab === 'Videos' && (
          videos_loading ? (
            <div className="double-shell">
              <div className="double-core flex h-60 items-center justify-center">
                <div className="spinner" />
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="double-shell">
              <div className="double-core px-6 py-14 text-center">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">No videos</p>
                <p className="mt-3 text-[1.7rem] text-[#f5f6fb]">No trailers or related video clips are available.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {featuredVideo && <Video key={featuredVideo.id} video={featuredVideo} featured />}
              {remainingVideos.length > 0 && (
                <div className="grid gap-3 lg:grid-cols-2">
                  {remainingVideos.map((item) => (
                    <Video key={item.id} video={item} />
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TvDetail;
