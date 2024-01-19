// core
import { createHash } from 'crypto';

// 3rd party
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { extension } from 'mime-types';
import { imageSize } from 'image-size';

// package
import { db } from '@wwyd/db';

// lib
import { getS3Client } from '@/lib/server';
import { ErrorResponse, CreateImageResponse } from '@/lib';

/**
 * POST /api/images
 *
 * Called by `createImage`.
 */

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateImageResponse | ErrorResponse>> {
  const data = await request.formData();
  const file = data.get('file');

  if (file === null || typeof file === 'string') {
    return NextResponse.json(
      { status: 400, message: 'File invalid' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { width, height } = imageSize(buffer);
  const checksum = createHash('md5').update(buffer).digest('hex');
  const key = `${checksum}.${extension(file.type) || ''}`.replace(/\.$/, '');

  const { ETag }: PutObjectCommandOutput = await (
    await getS3Client()
  ).send(
    new PutObjectCommand({
      Bucket: `wwyd-${process.env.NODE_ENV}`,
      Key: key,
      ContentType: file.type,
      Body: buffer,
      ACL: 'public-read',
    }),
  );

  return typeof ETag === 'undefined'
    ? NextResponse.json(
        { status: 400, message: 'ETag undefined' },
        { status: 400 },
      )
    : ETag !== JSON.stringify(checksum)
    ? NextResponse.json(
        { status: 400, message: 'ETag mismatch' },
        { status: 400 },
      )
    : NextResponse.json({
        image: await db.image.create({
          data: {
            filename: file.name,
            contentType: file.type,
            byteSize: buffer.byteLength,
            width,
            height,
            checksum,
            key,
          },
        }),
      });
}
